package com.ziguonnana.ziguserver.websocket.global.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum GameType {
    BODY_TALK("몸으로 말해요"),
    SAME_POSE("일심동체"),
    FOLLOW_POSE("포즈따라하기"),
    SHORTS("숏폼 챌린지");

    private final String gameName;
}
