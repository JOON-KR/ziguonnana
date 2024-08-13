package com.ziguonnana.ziguserver.domain.member.controller;
import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.ziguonnana.ziguserver.domain.member.dto.EmailAuth;
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

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/member")
public class MemberController {

    private final MemberService memberService;
    private final RedisService redisService;
    private final JwtUtil jwtUtil;

    @Value("${kakao.client_id}")
    private String clientId;

    @Value("${kakao.redirect_uri}")
    private String redirectUri;

    @Value("${kakao.token_uri}")
    private String tokenUri;

    @Value("${kakao.user_info_uri}")
    private String userInfoUri;

    @GetMapping
    public ResponseEntity<MemberResponse> getMember() {
        return ResponseEntity.status(200).body(memberService.getMember());
    }

    @PostMapping("login")
    public ResponseEntity<ResponseDto<TokenResponse>> login(@Valid @RequestBody LoginRequest request) {
        String accessToken = memberService.login(request);
        CustomUserInfo userInfo = memberService.getUserInfo(request.email());
        String refreshToken = jwtUtil.createRefreshToken(userInfo);
        redisService.saveRefreshToken(request.email(), refreshToken);
        log.info("req: {},access: {}, refresh: {}", request, accessToken, refreshToken);
        return ResponseEntity.status(200).body(ResponseDto.success(new TokenResponse(accessToken, refreshToken)));
    }

    @PostMapping("logout")
    public ResponseEntity<ResponseDto<String>> logout(@Valid @RequestBody LogoutRequest request) {
        String accessToken = request.accessToken();
        memberService.logout(accessToken);
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

    @GetMapping("/login/kakao")
    public ResponseEntity<String> loginKakao() {
        String redirectUrl = "https://kauth.kakao.com/oauth/authorize?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&response_type=code";
        return ResponseEntity.status(302).header("Location", redirectUrl).build();
    }

    @GetMapping("/login/kakao/callback")
    public ResponseEntity<Void> loginKakaoCallback(@RequestParam("code") String code, HttpServletResponse response) {
        TokenResponse tokenResponse = memberService.kakaoLogin(code);

        // 쿠키에 토큰을 저장
        Cookie authCookie = new Cookie("accessToken", tokenResponse.accessToken());
        Cookie refreshCookie = new Cookie("refreshToken", tokenResponse.refreshToken());
        authCookie.setHttpOnly(true); // XSS 방지
        authCookie.setSecure(true); // HTTPS에서만 전송
        authCookie.setPath("/"); // 모든 경로에서 쿠키 접근 가능
        authCookie.setMaxAge(60); // 1분 동안 유효
        refreshCookie.setHttpOnly(true); // XSS 방지
        refreshCookie.setSecure(true); // HTTPS에서만 전송
        refreshCookie.setPath("/"); // 모든 경로에서 쿠키 접근 가능
        refreshCookie.setMaxAge(60); // 1분 동안 유효

        response.addCookie(authCookie);
        response.addCookie(refreshCookie);

        // 클라이언트의 특정 URL로 리디렉트
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/")).build();
    }

    
    @GetMapping("/password/{email}")
    public ResponseEntity<ResponseDto<String>> findPassword(@PathVariable("email")String email){
    	memberService.findPassword(email);
    	return ResponseEntity.ok(ResponseDto.success("성공"));
    }
    
    @PostMapping("/password")
    public ResponseEntity<ResponseDto<String>> findPassword( @RequestBody EmailAuth auth){
    	String password = memberService.resetPassword(auth);
    	return ResponseEntity.ok(ResponseDto.success(password));
    }
}
