package com.ziguonnana.ziguserver.domain.member.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ziguonnana.ziguserver.domain.member.dto.EmailListResponse;
import com.ziguonnana.ziguserver.domain.member.dto.LoginRequest;
import com.ziguonnana.ziguserver.domain.member.dto.LogoutRequest;
import com.ziguonnana.ziguserver.domain.member.dto.MemberRequest;
import com.ziguonnana.ziguserver.domain.member.dto.MemberResponse;
import com.ziguonnana.ziguserver.domain.member.dto.UpdateRequest;
import com.ziguonnana.ziguserver.domain.member.dto.UpdateResponse;
import com.ziguonnana.ziguserver.domain.member.entity.Member;
import com.ziguonnana.ziguserver.domain.member.service.MemberService;
import com.ziguonnana.ziguserver.global.ResponseDto;
import com.ziguonnana.ziguserver.redis.RedisService;
import com.ziguonnana.ziguserver.security.dto.CustomUserInfo;
import com.ziguonnana.ziguserver.security.dto.TokenResponse;
import com.ziguonnana.ziguserver.security.util.JwtUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/member")
public class MemberController {

	private final MemberService memberService;
	private final RedisService redisService;
	private final JwtUtil jwtUtil;

	@GetMapping
	public ResponseEntity<MemberResponse> getMember() {
		return ResponseEntity.status(200).body(memberService.getMember());
	}
	
	@PostMapping("login")
	public ResponseEntity<ResponseDto<TokenResponse>> login(
		@Valid @RequestBody LoginRequest request
	) {
		String accessToken = memberService.login(request);
		CustomUserInfo userInfo = memberService.getUserInfo(request.email());
		String refreshToken = jwtUtil.createRefreshToken(userInfo);
		redisService.saveRefreshToken(request.email(), refreshToken);
		log.info("req: {},access: {}, refresh: {}",request,accessToken,refreshToken);
		return ResponseEntity.status(200).body(ResponseDto.success(new TokenResponse(accessToken, refreshToken)));
	}

	@PostMapping("logout")
	public ResponseEntity<ResponseDto<String>> logout(@Valid @RequestBody LogoutRequest request) {
		String email = request.email();
		String accessToken = request.accessToken();
		memberService.logout(email, accessToken);
		return ResponseEntity.status(200).body(ResponseDto.success(""));
	}
	
	@PostMapping("signup")
	public ResponseEntity<ResponseDto<MemberResponse>> signup(@Valid @RequestBody MemberRequest member) {
		log.info("member info {}", member);
		Member entity = Member.from(member);
		log.info("after ModelMapper info {}", entity.toString());
		Long id = memberService.signup(entity);
		return ResponseEntity.status(201).body(ResponseDto.success(MemberResponse.from(entity)));
	}

	@PutMapping
	public ResponseEntity<ResponseDto<UpdateResponse>> update(@Valid @RequestBody UpdateRequest request) {
		Member updateMember = memberService.update(request);
		return ResponseEntity.status(200).body(ResponseDto.success(UpdateResponse.create(updateMember)));
	}

	@DeleteMapping
	public ResponseEntity<ResponseDto<String>> delete() {
		memberService.delete();
		return ResponseEntity.status(200).body(ResponseDto.success(""));
	}

//	@GetMapping("all")
//	public ResponseEntity<EmailListResponse> getAllEmails() {
//		return ResponseEntity.status(HttpStatus.OK).body(memberService.getEmails());
//	}
//
//	@PostMapping("refresh")
//	public ResponseEntity<TokenResponse> refresh(@RequestBody String refreshToken) {
//		if (redisService.isTokenBlacklisted(refreshToken)) {
//			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new TokenResponse(null, "블랙리스트에 등록된 토큰입니다."));
//		}
//
//		if (!jwtUtil.isValidToken(refreshToken)) {
//			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new TokenResponse(null, "유효하지 않은 토큰입니다."));
//		}
//
//		String email = jwtUtil.getUsernameFromToken(refreshToken);
//		Member member = memberService.getMemberByEmail(email)
//			.orElseThrow(() -> new UsernameNotFoundException("멤버가 존재하지 않습니다."));
//		CustomUserInfo info = CustomUserInfo.from(member);
//		String newAccessToken = jwtUtil.createAccessToken(info);
//		return ResponseEntity.status(HttpStatus.OK).body(new TokenResponse(newAccessToken, refreshToken));
//	}
}
