package com.ziguonnana.ziguserver.websocket.bodytalk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class BodyResponse<T> {
    private String message;
    private CommandType commandType;
    private T data;

    public static <T> BodyResponse<T> ok ( CommandType commandType, T data){
        return new BodyResponse<>("SUCCESS", commandType, data);
    }
}
