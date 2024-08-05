package com.ziguonnana.ziguserver.exception;

public class AnswerException extends RuntimeException {
    public AnswerException(String message) {
        super(message);
    }

    public AnswerException(String message, Throwable cause) {
        super(message, cause);
    }
}
