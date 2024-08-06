package com.ziguonnana.ziguserver.domain.room.controller;

import com.ziguonnana.ziguserver.domain.room.dto.RoomRequest;
import com.ziguonnana.ziguserver.domain.room.dto.RoomInviteResponse;
import com.ziguonnana.ziguserver.domain.room.dto.RoomResponse;
import com.ziguonnana.ziguserver.domain.room.service.RoomService;
import com.ziguonnana.ziguserver.global.ResponseDto;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/room")
@Slf4j
public class RoomController {
    private final RoomService roomService;

    // 회의 방 생성 - 이글루 생성
    @PostMapping()
    public ResponseEntity<ResponseDto<RoomInviteResponse>> createRoom(@RequestBody RoomRequest roomRequest) throws OpenViduJavaClientException, OpenViduHttpException {
        RoomInviteResponse response = roomService.createRoom(roomRequest);
        return ResponseEntity.status(201).body(ResponseDto.success(response));
    }

    // 회의 참가
    @PostMapping("{roomId}")
    public ResponseEntity<ResponseDto<RoomResponse>> connectTeam(@PathVariable("roomId") String roomId) throws OpenViduJavaClientException, OpenViduHttpException {
        RoomResponse response = roomService.connectRoom(roomId);
        return ResponseEntity.ok().body(ResponseDto.success(response));
    }
}
