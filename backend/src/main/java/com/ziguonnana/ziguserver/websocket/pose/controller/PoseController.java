package com.ziguonnana.ziguserver.websocket.pose.controller;

import java.util.List;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.KeyPoint;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;
import com.ziguonnana.ziguserver.websocket.pose.service.PoseService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class PoseController {

	private final PoseService poseService;

	@MessageMapping("/game/{roomId}/pose/{poseType}")
	@SendTo("/topic/game/{roomId}")
	public Response<Integer> gameStart(@DestinationVariable("roomId") String roomId, @DestinationVariable("poseType") int poseType) {
		log.info("=========" + poseType + " 번 포즈 시작=========");
		return Response.ok(CommandType.POSE_TYPE, poseType);
	}

	 @MessageMapping("/game/{roomId}/pose/{poseType}/result")
	    public void gameStart(@DestinationVariable("roomId") String roomId,
	                          @DestinationVariable("poseType") int poseType,
	                          @Payload List<KeyPoint> keyPoints) {
	        log.info("포즈 좌표 전송: roomId={}, poseType={}", roomId, poseType);

	        // 키포인트를 처리하여 PoseResult로 변환한 후 계산 수행
	        poseService.processKeyPoints(roomId, poseType, keyPoints);
	    }
}