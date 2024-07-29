package com.ziguonnana.ziguserver.domain.member;

public record LogoutRequest(String email, String refreshToken) {
}
