package com.ziguonnana.ziguserver.global;

import org.springframework.security.core.context.SecurityContextHolder;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public final class TokenInfo {

    private TokenInfo(){}

    public static Long getMemberId() {

        return Long.parseLong(SecurityContextHolder.getContext()
                .getAuthentication()
                .getName());
    }
}
