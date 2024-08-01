package com.ziguonnana.ziguserver.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;


@Getter
@AllArgsConstructor
public class OpenviduException extends RuntimeException{
    private ErrorCode errorCode;
    private String message;

    public OpenviduException(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }

    @Override
    public String toString() {
        if (message == null) {
            return errorCode.getMessage();
        }
        return String.format("%s %s", errorCode.getMessage(), message);
    }

}
