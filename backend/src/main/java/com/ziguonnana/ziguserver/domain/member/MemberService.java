package com.ziguonnana.ziguserver.domain.member;

import java.util.List;
import java.util.Optional;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.TokenInfo;
import com.ziguonnana.ziguserver.redis.RedisService;
import com.ziguonnana.ziguserver.security.dto.CustomUserInfo;
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

	private final JwtUtil jwtUtil;
	private final MemberRepository memberRepository;
	private final PasswordEncoder encoder;
	private final RedisService redisService;

	public String login(LoginRequest request) {
		String email = request.email();
		String password = request.password();
		log.info("request.password {}", password);
		Optional<Member> member = memberRepository.findByEmail(email);
		if (member.isEmpty()) {
			throw new UsernameNotFoundException("이메일이 존재하지 않습니다.");
		}
		log.info("member.get().getPassword {}", member.get().getPassword());
		if (!encoder.matches(password, member.get().getPassword())) {
			throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
		}
		CustomUserInfo info = CustomUserInfo.from(member.get());
		log.info("CustomUserInfoDto {}", info.toString());
		String accessToken = jwtUtil.createAccessToken(info);
		String refreshToken = jwtUtil.createRefreshToken(info);

		redisService.saveRefreshToken(info.email(), refreshToken);
		return accessToken;
	}

	public void logout(String email, String refreshToken) {
		// 리프레시 토큰을 블랙리스트에 추가
		long remainingTime = jwtUtil.getRemainingTime(refreshToken);
		redisService.addTokenToBlacklist(refreshToken, remainingTime);
		redisService.deleteRefreshToken(email);
	}


	public Long signup(Member member) {
		Optional<Member> validMember = memberRepository.findByEmail(member.getEmail());

		if (validMember.isPresent()) {
			throw new ValidateMemberException("this member email is already exist. " + member.getEmail());
		}
		log.info("member.getPassword {}", member.getPassword());
		member.updatePassword(encoder.encode(member.getPassword()));
		log.info("member info {}", member);
		memberRepository.save(member);
		return member.getId();
	}

	public Member update(UpdateRequest request) {
		Long memberId = TokenInfo.getMemberId();
		Optional<Member> originMember = memberRepository.findById(memberId);
		if(originMember.isEmpty()) {
			throw new MemberNotFoundException();
		}
		Member origin = originMember.get();
		String newPassword = request.password() != null ? encoder.encode(request.password()) : origin.getPassword();
		String newName = request.name() != null ? request.name() : origin.getName();
		Member updateMember = Member.builder()
			.id(memberId)
			.email(origin.getEmail())
			.password(newPassword)
			.name(newName)
			.role(origin.getRole())
			.build();
		return memberRepository.save(updateMember);
	}

	public void delete() {
		Long memberId = TokenInfo.getMemberId();
		Optional<Member> originMember = memberRepository.findById(memberId);

		if(originMember.isEmpty()) {
			throw new MemberNotFoundException();
		}

		memberRepository.delete(originMember.get());
	}

	public Member getMember() {
		Long memberId = TokenInfo.getMemberId();
		log.info("memberId {}", memberId);
		return memberRepository.findById(memberId)
			.orElseThrow(() -> new MemberNotFoundException("멤버가 존재하지 않습니다."));
	}

	public Optional<Member> getMember(Long memberId) {
		return Optional.ofNullable(memberRepository.findById(memberId)
			.orElseThrow(() -> new MemberNotFoundException("멤버가 존재하지 않습니다.")));
	}

	public Optional<Member> getMemberByEmail(String email) {
		return memberRepository.findByEmail(email);
	}

	public EmailListResponse getEmails() {
		List<String> emails = memberRepository.findAll().stream()
			.map(Member::getEmail)
			.toList();

		return EmailListResponse.builder().emails(emails).build();
	}

	public CustomUserInfo getUserInfo(String email) {
		Member member = memberRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return CustomUserInfo.from(member);
	}


	public void sameUserCheck(Long memberId, Long othersMemberId) {
		if (memberId.equals(othersMemberId)) throw new SameMemberException();
	}
}
