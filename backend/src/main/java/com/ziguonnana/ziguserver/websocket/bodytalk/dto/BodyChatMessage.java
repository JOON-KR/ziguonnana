package com.ziguonnana.ziguserver.websocket.bodytalk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BodyChatMessage {
    private int senderNum;
    private String content;
    private boolean isCorrect;

}
