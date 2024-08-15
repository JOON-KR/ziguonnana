package com.ziguonnana.ziguserver.websocket.global.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoadingPlayerInfo {
    private String nickname;
    private int num;

    @Override
    public String toString() {
        return "LoadingPlayerInfo{" +
                "nickname='" + nickname + '\'' +
                ", num=" + num +
                '}';
    }
}
