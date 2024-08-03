package com.ziguonnana.ziguserver.websocket.controller;

import com.ziguonnana.ziguserver.websocket.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.websocket.service.WebsocketService;

import lombok.RequiredArgsConstructor;
@RequiredArgsConstructor
@Controller
@Slf4j
public class WebsocketController {
    private final WebsocketService websocketService;

    @MessageMapping("/game/{roomId}/create")
    @SendTo("topic/game/{roomId}")
    public GameMessage<SessionInfo> createRoom(@DestinationVariable("roomId") String roomId) {
        SessionInfo response = websocketService.createRoom(roomId);
        return GameMessage.info("방 생성 완료",response);
    }
    @MessageMapping("/game/{roomId}/profile")
    @SendTo("topic/game/{roomId}")
    public GameMessage<String> createGameProfile(@DestinationVariable("roomId") String roomId, @Payload GameProfileRequest request) {
        websocketService.createProfile(roomId,request);
        return GameMessage.info("프로필생성완료","");
    }
    @MessageMapping("/game/{roomId}/join")
    @SendTo("/topic/game/{roomId}")
    public GameMessage<SessionInfo> joinRoom(@DestinationVariable("roomId") String roomId, @Payload GameProfile profile) {
        SessionInfo response = websocketService.join(roomId,profile);
        return GameMessage.info("방 참가 완료",response);
    }

    @MessageMapping("/game/{roomId}/send")
    @SendTo("/topic/game/{roomId}")
    public GameMessage sendMessage(@DestinationVariable("roomId") String roomId, @Payload GameMessage message) {
        return message;
    }

    //   자기소개 문답 답변
    @MessageMapping("/game/{roomId}/self-introduction")
    public GameMessage<String> getAnswer(@DestinationVariable("roomId") String roomId, @Payload SelfIntroductionRequest request) {
        log.info("=======자기소개 문답 답변 전송 시작=======");
        websocketService.getSelfIntroductionAnswer(roomId, request);
        return GameMessage.info("자기소개 문답 전송 완료", "");
    }
}
