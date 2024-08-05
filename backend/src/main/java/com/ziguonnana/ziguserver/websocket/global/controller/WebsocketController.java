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
    public void createRoom(@DestinationVariable("roomId") String roomId, @Payload CreateRequest request) {
         websocketService.createRoom(roomId, request);
    }

    @MessageMapping("/game/{roomId}/profile")
    public void createGameProfile(@DestinationVariable("roomId") String roomId, @Payload GameProfileRequest request) {
        websocketService.createProfile(roomId, request);
    }

    @MessageMapping("/game/{roomId}/{memberId}/join")
    public void joinRoom(@DestinationVariable("roomId") String roomId,@DestinationVariable("memberId") String memberId, @Payload GameProfile profile) {
    	websocketService.join(roomId, profile,memberId);
    }

    @MessageMapping("/game/{roomId}/chat")
    @SendTo("/topic/game/{roomId}")
    public GameMessage<ChatMessage> sendMessage(@DestinationVariable("roomId") String roomId, @Payload ChatMessage chatMessage) {
        return GameMessage.info(chatMessage.getSender() + ": " + chatMessage.getContent(), chatMessage);
    }
}
