package com.ziguonnana.ziguserver.domain.member.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.domain.member.dto.EmailListResponse;
import com.ziguonnana.ziguserver.domain.member.dto.LoginRequest;
import com.ziguonnana.ziguserver.domain.member.dto.MemberResponse;
import com.ziguonnana.ziguserver.domain.member.dto.UpdateRequest;
import com.ziguonnana.ziguserver.domain.member.entity.Member;
import com.ziguonnana.ziguserver.domain.member.repository.MemberRepository;
import com.ziguonnana.ziguserver.global.TokenInfo;
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

	public void delete() {
	    Long memberId = TokenInfo.getMemberId();
	    Optional<Member> originMember = Optional.ofNullable(memberRepository.findById(memberId)
	    		.orElseThrow(() ->  new MemberNotFoundException("멤버가 존재하지 않습니다.")));

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
    public void logout( String accessToken) {
    	String email = getMember(TokenInfo.getMemberId()).get().getEmail();
        long remainingTime = jwtUtil.getRemainingTime(accessToken);
        redisService.addTokenToBlacklist(accessToken, remainingTime);
        redisService.deleteRefreshToken(email);
    }

    public Long signup(Member member) {
        memberRepository.findByEmail(member.getEmail())
            .ifPresent(validMember -> {
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

        Member origin = memberRepository.findById(memberId)
            .orElseThrow(MemberNotFoundException::new);

        String newPassword = Optional.ofNullable(request.password())
            .map(encoder::encode)
            .orElse(origin.getPassword());

        String newName = Optional.ofNullable(request.name())
            .orElse(origin.getName());

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
        Member member = memberRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return CustomUserInfo.from(member);
    }

    public void sameUserCheck(Long memberId, Long othersMemberId) {
        if (memberId.equals(othersMemberId)) throw new SameMemberException();
    }
}
