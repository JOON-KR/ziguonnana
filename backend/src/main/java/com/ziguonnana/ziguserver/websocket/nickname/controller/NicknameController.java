package com.ziguonnana.ziguserver.websocket.nickname.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.websocket.nickname.dto.Nickname;
import com.ziguonnana.ziguserver.websocket.nickname.service.NicknameService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class NicknameController {
    private final NicknameService nicknameService;
    
    @MessageMapping("/game/{roomId}/nickname")
    public void createGameProfile(@DestinationVariable("roomId") String roomId, @Payload Nickname nickname) {
    	nicknameService.create(roomId,nickname);
    }
}
