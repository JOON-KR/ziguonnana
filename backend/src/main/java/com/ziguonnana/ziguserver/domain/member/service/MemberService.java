package com.ziguonnana.ziguserver.domain.member.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.annotation.ObjectIdGenerators.UUIDGenerator;
import com.ziguonnana.ziguserver.domain.member.dto.EmailAuth;
import com.ziguonnana.ziguserver.domain.member.dto.EmailListResponse;
import com.ziguonnana.ziguserver.domain.member.dto.LoginRequest;
import com.ziguonnana.ziguserver.domain.member.dto.MemberResponse;
import com.ziguonnana.ziguserver.domain.member.dto.RoleType;
import com.ziguonnana.ziguserver.domain.member.dto.UpdateRequest;
import com.ziguonnana.ziguserver.domain.member.entity.Member;
import com.ziguonnana.ziguserver.domain.member.repository.MemberRepository;
import com.ziguonnana.ziguserver.global.TokenInfo;
import com.ziguonnana.ziguserver.redis.RedisService;
import com.ziguonnana.ziguserver.security.dto.CustomUserInfo;
import com.ziguonnana.ziguserver.security.dto.TokenResponse;
import com.ziguonnana.ziguserver.security.exception.MemberNotFoundException;
import com.ziguonnana.ziguserver.security.exception.SameMemberException;
import com.ziguonnana.ziguserver.security.exception.ValidateMemberException;
import com.ziguonnana.ziguserver.security.util.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {
	final char[] charSet = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
			'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' };

	private final JwtUtil jwtUtil;
	private final MemberRepository memberRepository;
	private final PasswordEncoder encoder;
	private final RedisService redisService;
	private final RestTemplate restTemplate;
	private final JavaMailSender mailSender;

	@Value("${kakao.client_id}")
	private String clientId;

	@Value("${kakao.redirect_uri}")
	private String redirectUri;

	@Value("${kakao.token_uri}")
	private String tokenUri;

	@Value("${kakao.user_info_uri}")
	private String userInfoUri;

	public String login(LoginRequest request) {
		String email = request.email();
		String password = request.password();
		log.info("request.password {}", password);

		Member member = memberRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("이메일이 존재하지 않습니다."));

		log.info("member.getPassword {}", member.getPassword());

		if (!encoder.matches(password, member.getPassword())) {
			throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
		}

		CustomUserInfo info = CustomUserInfo.from(member);
		log.info("CustomUserInfoDto {}", info.toString());

		String accessToken = jwtUtil.createAccessToken(info);
		String refreshToken = jwtUtil.createRefreshToken(info);

		redisService.saveRefreshToken(info.email(), refreshToken);
		return accessToken;
	}

	public TokenResponse kakaoLogin(String code) {
		// 토큰 요청
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", clientId);
		params.add("redirect_uri", redirectUri);
		params.add("code", code);

		HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
		ResponseEntity<Map> response = restTemplate.postForEntity(tokenUri, entity, Map.class);
		String accessToken = response.getBody().get("access_token").toString();

		// 사용자 정보 요청
		HttpHeaders userInfoHeaders = new HttpHeaders();
		userInfoHeaders.set("Authorization", "Bearer " + accessToken);

		HttpEntity<?> userInfoEntity = new HttpEntity<>(userInfoHeaders);
		ResponseEntity<Map> userInfoResponse = restTemplate.postForEntity(userInfoUri, userInfoEntity, Map.class);
		Map<String, Object> kakaoAccount = (Map<String, Object>) userInfoResponse.getBody().get("kakao_account");

		String email = kakaoAccount.get("email").toString();
		String nickname = ((Map<String, Object>) kakaoAccount.get("profile")).get("nickname").toString();

		Member member = memberRepository.findByEmail(email).orElseGet(
				() -> memberRepository.save(Member.builder()
						.email(email)
						.name(nickname)
						.role(RoleType.USER)
						.build()));

		CustomUserInfo userInfo = CustomUserInfo.from(member);
		String jwtToken = jwtUtil.createAccessToken(userInfo);
		String refreshToken = jwtUtil.createRefreshToken(userInfo);

		// redisService.saveRefreshToken(email, refreshToken);

		return new TokenResponse(jwtToken, refreshToken);
	}

	public void delete() {
		Long memberId = TokenInfo.getMemberId();
		Optional<Member> originMember = Optional.ofNullable(
				memberRepository.findById(memberId).orElseThrow(() -> new MemberNotFoundException("멤버가 존재하지 않습니다.")));

		Member origin = originMember.get();
		origin.setIsDelete(true);

		memberRepository.saveAndFlush(origin);
	}

	public MemberResponse getMember() {
		Long memberId = TokenInfo.getMemberId();
		log.info("memberId {}", memberId);
		Member member = memberRepository.findById(memberId)
				.orElseThrow(() -> new MemberNotFoundException("멤버가 존재하지 않습니다."));

		// Member 객체를 MemberResponse 객체로 변환
		return MemberResponse.builder()
				.email(member.getEmail())
				.profileImage(member.getProfileImage())
				.name(member.getName())
				.regDate(member.getRegDate())
				.build();
	}

	public void logout(String accessToken) {
		String email = getMember(TokenInfo.getMemberId()).get().getEmail();
		long remainingTime = 86400000;
		redisService.addTokenToBlacklist(accessToken, remainingTime);
		redisService.deleteRefreshToken(email);
	}

	public Long signup(Member member) {
		memberRepository.findByEmail(member.getEmail()).ifPresent(validMember -> {
			throw new ValidateMemberException("this member email is already exist. " + member.getEmail());
		});

		log.info("member.getPassword {}", member.getPassword());
		member.updatePassword(encoder.encode(member.getPassword()));
		log.info("member info {}", member);
		memberRepository.save(member);
		return member.getId();
	}

	public Member update(UpdateRequest request) {
		Long memberId = TokenInfo.getMemberId();

		Member origin = memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);

		String newPassword = Optional.ofNullable(request.password()).map(encoder::encode).orElse(origin.getPassword());

		String newName = Optional.ofNullable(request.name()).orElse(origin.getName());

		Member updateMember = Member.builder()
				.id(memberId)
				.email(origin.getEmail())
				.password(newPassword)
				.name(newName)
				.role(origin.getRole())
				.build();

		return memberRepository.save(updateMember);
	}

	public Optional<Member> getMember(Long memberId) {
		return Optional.ofNullable(
				memberRepository.findById(memberId).orElseThrow(() -> new MemberNotFoundException("멤버가 존재하지 않습니다.")));
	}

	public Optional<Member> getMemberByEmail(String email) {
		return memberRepository.findByEmail(email);
	}

	public EmailListResponse getEmails() {
		List<String> emails = memberRepository.findAll().stream().map(Member::getEmail).toList();

		return EmailListResponse.builder().emails(emails).build();
	}

	public CustomUserInfo getUserInfo(String email) {
		Member member = memberRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return CustomUserInfo.from(member);
	}

	public void sameUserCheck(Long memberId, Long othersMemberId) {
		if (memberId.equals(othersMemberId))
			throw new SameMemberException();
	}

	public void findPassword(String email) {
		Member member = memberRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		String auth = member.getAuth();
		String tempAuth = "";
		for (int i = 0; i < 6; i++) { // charSet 배열에서 무작위로 문자를 뽑아 임시 비밀번호를 생성합니다.
			int idx = (int) (charSet.length * Math.random());
			tempAuth += charSet[idx];
		}
		Member updateMember = Member.builder()
				.id(member
				.getId())
				.email(member.getEmail())
				.password(member.getPassword())
				.name(member.getName())
				.role(member.getRole())
				.auth(tempAuth)
				.build();

		memberRepository.save(updateMember);
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("yyj4148@naver.com");
		message.setTo(email);
		message.setSubject("[zigu on nana] " + member.getName()+ "님의 인증번호 안내 이메일입니다.");
		message.setText("안녕하세요. SPONITY입니다.\n" + member.getName() + "님의 인증번호는 " + tempAuth + "입니다.\n"
				+ "로그인 후 즉시 비밀번호를 변경해주세요.");
		mailSender.send(message);

	}
	
	public String resetPassword (EmailAuth request) {
		Member member = memberRepository.findByEmail(request.email())
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		String auth = member.getAuth();
		String tempPassword = "";
		for (int i = 0; i < 8; i++) { // charSet 배열에서 무작위로 문자를 뽑아 임시 비밀번호를 생성합니다.
			int idx = (int) (charSet.length * Math.random());
			tempPassword += charSet[idx];
		}
		
		String encodedPassword = encoder.encode(tempPassword);
		Member updateMember = Member.builder()
				.id(member
				.getId())
				.email(member.getEmail())
				.password(encodedPassword)
				.name(member.getName())
				.role(member.getRole())
				.auth(UUID.randomUUID()+"")
				.build();
		
		memberRepository.save(updateMember);
		return tempPassword;
	}
}
