package com.ziguonnana.ziguserver.websocket.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class SelfIntroductionRequest {
    private String memberId;
    private List<String> answer;
}
