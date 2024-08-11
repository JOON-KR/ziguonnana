package com.ziguonnana.ziguserver.websocket.shorts.dto;

import com.ziguonnana.ziguserver.exception.ShortsException;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;

@AllArgsConstructor
@Getter
public enum ShortsAudio {
    FIRST_SHORTS_AUDIO(1, "https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/df99d415-6ce7-4da3-949f-4c397533cb27.ogg");

    private final int shortsId;
    private final String shortsAudioUrl;

    public static String getShortsAudioUrlByShortsId(int shortsId) {
        return Arrays.stream(ShortsAudio.values())
                .filter(e -> e.getShortsId() == shortsId)
                .findFirst()
                .map(ShortsAudio::getShortsAudioUrl)
                .orElseThrow(() -> new ShortsException("해당하는 shorts audio가 없습니다."));
    }
}
