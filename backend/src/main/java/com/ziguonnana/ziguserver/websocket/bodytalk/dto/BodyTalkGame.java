package com.ziguonnana.ziguserver.websocket.bodytalk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class BodyTalkGame {
    private Keyword keyword;
    private int correctCnt;
    private Instant startTime;
    private Instant endTime;
    private long durationTime; //초 단위

    public void changeKeyword(Keyword keyword) {
        this.keyword = keyword;
    }

    public void plusCorrectCnt(){
        this.correctCnt++;
    }

    public void startGame(){
        this.startTime = Instant.now();
    }


    public void calculateDurationTime() {
        this.endTime = Instant.now();
        this.durationTime = Duration.between(startTime, endTime).getSeconds();
    }
}
