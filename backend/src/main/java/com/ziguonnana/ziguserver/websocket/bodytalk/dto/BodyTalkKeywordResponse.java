package com.ziguonnana.ziguserver.websocket.bodytalk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class BodyTalkKeywordResponse {
    private String keywordType;
    private int explanierNum;
}
