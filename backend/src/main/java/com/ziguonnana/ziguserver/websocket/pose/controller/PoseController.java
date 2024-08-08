package com.ziguonnana.ziguserver.websocket.pose.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;
import com.ziguonnana.ziguserver.websocket.pose.service.PoseService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class PoseController {

	private final PoseService poseService;

	@MessageMapping("/game/{roomId}/pose/{number}")
	@SendTo("/topic/game/{roomId}")
	public Response<Integer> gameStart(@DestinationVariable("roomId") String roomId, @DestinationVariable("number") int number) {
		log.info("=========" + number + " 번 포즈 시작=========");
		return Response.ok(CommandType.POSE_TYPE, number);
	}

	@MessageMapping("/game/{roomId}/pose/result")
	@SendTo("/topic/game/{roomId}")
	public void gameStart(@DestinationVariable("roomId") String roomId, @Payload PoseResult request) {
		log.info("포즈 좌표 전송");
		poseService.calculate(roomId,request);
	}
}