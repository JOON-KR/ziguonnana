package com.ziguonnana.ziguserver.exception;

public class RoomException extends RuntimeException {
    public RoomException(String message) {
        super(message);
    }

    public RoomException(String message, Throwable cause) {
        super(message, cause);
    }
}
