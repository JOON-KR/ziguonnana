package com.ziguonnana.ziguserver.domain.member.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<ResponseDto<TokenResponse>> loginKakaoCallback(@RequestParam("code") String code) {
        TokenResponse tokenResponse = memberService.kakaoLogin(code);
        return ResponseEntity.status(200).body(ResponseDto.success(tokenResponse));
    }
}
