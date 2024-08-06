package com.ziguonnana.ziguserver.websocket.bodytalk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class BodyChatRequest {
    private int senderNum;
    private String content;
}
