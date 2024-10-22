package com.ziguonnana.ziguserver.websocket.bodytalk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Getter
@Builder
@NoArgsConstructor
public class BodyTalkResult {
    private long durationTime; //초단위
    private int correctCnt;  // 맞은 문제 갯수

    @Override
    public String toString() {
        return "BodyTalkResult{" +
                "durationTime=" + durationTime +
                ", correctCnt=" + correctCnt +
                '}';
    }
}
