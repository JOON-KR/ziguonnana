package com.ziguonnana.ziguserver.websocket.answer.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.websocket.answer.dto.SelfIntroductionRequest;
import com.ziguonnana.ziguserver.websocket.answer.service.AnswerService;
import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Controller
@Slf4j
@RequiredArgsConstructor
public class AnswerController {
	
	private final AnswerService answerService;
	
	//   자기소개 문답 답변
    @MessageMapping("/game/{roomId}/self-introduction")
    public GameMessage<String> getAnswer(@DestinationVariable("roomId") String roomId, @Payload SelfIntroductionRequest request) {
        log.info("=======자기소개 문답 답변 전송 시작=======");
        answerService.getSelfIntroductionAnswer(roomId, request);
        return GameMessage.info("자기소개 문답 전송 완료", "");
    }

}
