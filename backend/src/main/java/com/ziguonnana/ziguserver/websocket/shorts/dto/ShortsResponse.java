package com.ziguonnana.ziguserver.websocket.shorts.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ShortsResponse {
    private String challengeVideoUrl;
    private int currentUserNo;
    private long videoDuration;
    private int maxNo;

    @Override
    public String toString() {
        return "ShortsResponse{" +
                "challengeVideoUrl='" + challengeVideoUrl + '\'' +
                ", currentUserNo=" + currentUserNo +
                ", videoDuration=" + videoDuration +
                ", maxNo=" + maxNo +
                '}';
    }
}
