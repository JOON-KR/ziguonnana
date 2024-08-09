package com.ziguonnana.ziguserver.websocket.shorts.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ShortsResponse {
    private String challengeVideoUrl;
    private int currentUserNo;
}
