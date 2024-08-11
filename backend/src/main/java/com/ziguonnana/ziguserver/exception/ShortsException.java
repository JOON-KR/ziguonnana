package com.ziguonnana.ziguserver.exception;

public class ShortsException extends RuntimeException{
    public ShortsException(String message) {
        super(message);
    }

    public ShortsException(String message, Throwable cause) {
        super(message, cause);
    }

}
