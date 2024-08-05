package com.ziguonnana.ziguserver.websocket.answer.dto;


import java.util.List;

import lombok.Getter;

@Getter
public class SelfIntroductionRequest {
    private int num;
    private List<String> answer;
}
