package com.ziguonnana.ziguserver.websocket.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.websocket.dto.GameMessage;
import com.ziguonnana.ziguserver.websocket.dto.GameProfile;
import com.ziguonnana.ziguserver.websocket.dto.GameProfileRequest;
import com.ziguonnana.ziguserver.websocket.dto.SessionInfo;
import com.ziguonnana.ziguserver.websocket.service.WebsocketService;

import lombok.RequiredArgsConstructor;
@RequiredArgsConstructor
@Controller
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
}
