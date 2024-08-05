package com.ziguonnana.ziguserver.websocket.global.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.websocket.global.dto.ChatMessage;
import com.ziguonnana.ziguserver.websocket.global.dto.CreateRequest;
import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;
import com.ziguonnana.ziguserver.websocket.global.dto.GameProfile;
import com.ziguonnana.ziguserver.websocket.global.dto.GameProfileRequest;
import com.ziguonnana.ziguserver.websocket.global.dto.SessionInfo;
import com.ziguonnana.ziguserver.websocket.global.service.WebsocketService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class WebsocketController {
    private final WebsocketService websocketService;

    @MessageMapping("/game/{roomId}/create")
    @SendTo("topic/game/{roomId}")
    public GameMessage<SessionInfo> createRoom(@DestinationVariable("roomId") String roomId, @Payload CreateRequest request) {
        SessionInfo response = websocketService.createRoom(roomId, request);
        return GameMessage.info("방 생성 완료", response);
    }

    @MessageMapping("/game/{roomId}/profile")
    public void createGameProfile(@DestinationVariable("roomId") String roomId, @Payload GameProfileRequest request) {
        websocketService.createProfile(roomId, request);
    }

    @MessageMapping("/game/{roomId}/join")
    @SendTo("/topic/game/{roomId}")
    public GameMessage<SessionInfo> joinRoom(@DestinationVariable("roomId") String roomId, @Payload GameProfile profile) {
    	SessionInfo response =  websocketService.join(roomId, profile);
        return GameMessage.info("방 참가 완료", response);
    }

    @MessageMapping("/game/{roomId}/chat")
    @SendTo("/topic/game/{roomId}")
    public GameMessage<ChatMessage> sendMessage(@DestinationVariable("roomId") String roomId, @Payload ChatMessage chatMessage) {
        return GameMessage.info(chatMessage.getSender() + ": " + chatMessage.getContent(), chatMessage);
    }
}
