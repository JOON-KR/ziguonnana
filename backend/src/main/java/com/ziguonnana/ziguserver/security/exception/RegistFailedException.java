package com.ziguonnana.ziguserver.security.exception;

public class RegistFailedException extends IllegalArgumentException{

    private final static String message = "등록에 실패했습니다.";

    public RegistFailedException() {
        super(message);
    }
}
