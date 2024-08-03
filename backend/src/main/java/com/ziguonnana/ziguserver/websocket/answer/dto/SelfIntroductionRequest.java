package com.ziguonnana.ziguserver.websocket.answer.dto;


import java.util.List;

import lombok.Getter;

@Getter
public class SelfIntroductionRequest {
    private String memberId;
    private List<String> answer;
}
