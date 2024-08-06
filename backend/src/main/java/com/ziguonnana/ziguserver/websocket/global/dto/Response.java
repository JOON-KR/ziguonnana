package com.ziguonnana.ziguserver.websocket.global.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class Response<T> {
    private String message;
    private CommandType commandType;
    private T data;

    public static <T> Response<T> ok ( CommandType commandType, T data){
        return new Response<>("SUCCESS", commandType, data);
    }
}
