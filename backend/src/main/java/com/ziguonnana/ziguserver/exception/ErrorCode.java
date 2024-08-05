package com.ziguonnana.ziguserver.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    SESSION_NOT_FOUND(HttpStatus.NOT_FOUND,"해당 세션 id가 없습니다."),
    ROOM_PEOPLE_LIMIT(HttpStatus.BAD_REQUEST, "이미 회의 방의 최대 인원수입니다."),
    PLAYER_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 플레이어가 없습니다.");


    private final HttpStatus httpStatus;
    private final String message;
}
