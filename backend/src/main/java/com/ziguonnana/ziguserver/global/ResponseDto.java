package com.ziguonnana.ziguserver.global;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDto<T> {
    private String code;
    private String message;
    private T data;

    // 성공 응답을 위한 정적 메소드
    public static <T> ResponseDto<T> success(T data) {
        return new ResponseDto<>("status(201)", "SUCCESS", data);
    }

    // 실패 응답을 위한 정적 메소드
    public static <T> ResponseDto<T> failure(String code, String message) {
        return new ResponseDto<>(code, message, null);
    }
}
