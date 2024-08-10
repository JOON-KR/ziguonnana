package com.ziguonnana.ziguserver.websocket.shorts.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ShortsInfo {
    private String videoUrl;
    private long videoDuration;

    @Override
    public String toString() {
        return "ShortsInfo{" +
                "videoUrl='" + videoUrl + '\'' +
                ", videoDuration=" + videoDuration +
                '}';
    }
}
