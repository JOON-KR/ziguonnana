package com.ziguonnana.ziguserver.exception;

public class VideoNotFoundException extends RuntimeException {
    private static final String DEFAULT_MESSAGE = "비디오를 찾을 수 없습니다.";

    public VideoNotFoundException() {
        super(DEFAULT_MESSAGE);
    }
}
