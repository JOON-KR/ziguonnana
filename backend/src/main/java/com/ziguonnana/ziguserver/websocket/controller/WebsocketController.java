package com.ziguonnana.ziguserver.websocket.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.domain.profile.dto.ProfileRequest;
import com.ziguonnana.ziguserver.websocket.dto.GameMessage;
import com.ziguonnana.ziguserver.websocket.service.WebsocketService;

import lombok.RequiredArgsConstructor;
@RequiredArgsConstructor
@Controller
public class WebsocketController {
    private final WebsocketService websocketService;

    @MessageMapping("/game/{roomId}/create")
    @SendTo("topic/game/{roomId}")
    public GameMessage<String> createRoom(@DestinationVariable("roomId") String roomId, @Payload ProfileRequest profile) {
        String memberId = websocketService.createRoom(profile,roomId);
        return GameMessage.join(profile.getName(),memberId);
    }
    
    @MessageMapping("/game/{roomId}/join")
    @SendTo("/topic/game/{roomId}")
    public GameMessage<String> joinRoom(@DestinationVariable("roomId") String roomId, @Payload ProfileRequest profile) {
        String memberId = websocketService.join(roomId,profile);
        return GameMessage.join(profile.getName(),memberId);
    }

    @MessageMapping("/game/{roomId}/send")
    @SendTo("/topic/game/{roomId}")
    public GameMessage sendMessage(@DestinationVariable("roomId") String roomId, @Payload GameMessage message) {
        return message;
    }
}
