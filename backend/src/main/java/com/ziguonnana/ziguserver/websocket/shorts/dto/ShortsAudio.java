package com.ziguonnana.ziguserver.websocket.shorts.dto;

import com.ziguonnana.ziguserver.exception.ShortsException;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@AllArgsConstructor
@Getter
@Slf4j
public enum ShortsAudio {
    FIRST_SHORTS_AUDIO(1, "default"),
    SECOND_SHORTS_AUDIO(2, "default");

    private final int shortsId;
    private String shortsAudioUrl;

    public static String getShortsAudioUrlByShortsId(int shortsId) {
        return Arrays.stream(ShortsAudio.values())
                .filter(e -> e.getShortsId() == shortsId)
                .findFirst()
                .map(ShortsAudio::getShortsAudioUrl)
                .orElseThrow(() -> new ShortsException("해당하는 shorts audio가 없습니다."));
    }

    @Component
    public static class ShortsAudioConfig {
        @Value("${shorts.audio.first}")
        private String firstAudioUrl;

        @Value("${shorts.audio.second}")
        private String secondAudioUrl;

        @PostConstruct
        public void init() {
            FIRST_SHORTS_AUDIO.shortsAudioUrl = firstAudioUrl;
            SECOND_SHORTS_AUDIO.shortsAudioUrl = secondAudioUrl;
            log.info("audio 설정 완료");
        }
    }
}
