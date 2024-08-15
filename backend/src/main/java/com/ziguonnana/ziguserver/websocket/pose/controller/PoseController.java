package com.ziguonnana.ziguserver.websocket.pose.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.websocket.pose.dto.PoseRequest;
import com.ziguonnana.ziguserver.websocket.pose.dto.PoseSelect;
import com.ziguonnana.ziguserver.websocket.pose.service.PoseService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class PoseController {

    private final PoseService poseService;

    @MessageMapping("/game/{roomId}/pose/{poseType}/result")
    public void gameResult(@DestinationVariable("roomId") String roomId,
                          @DestinationVariable("poseType") int poseType,
                          @Payload PoseRequest poseRequest) {
        log.info("포즈 좌표 전송: roomId={}, poseType={}, num={}", roomId, poseType, poseRequest);

        // PoseRequest를 처리하여 PoseResult로 변환한 후 계산 수행
        poseService.processKeyPoints(roomId, poseType, poseRequest);
    }
    
    @MessageMapping("/game/{roomId}/pose")
    public void gameStart(@DestinationVariable("roomId") String roomId,@Payload PoseSelect pose) {
    	poseService.select(roomId,pose);
    }
}
