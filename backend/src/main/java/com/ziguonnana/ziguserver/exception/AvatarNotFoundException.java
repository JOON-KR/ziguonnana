package com.ziguonnana.ziguserver.exception;

public class AvatarNotFoundException extends RuntimeException {
    public AvatarNotFoundException(String message) {
        super(message);
    }

    public AvatarNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
