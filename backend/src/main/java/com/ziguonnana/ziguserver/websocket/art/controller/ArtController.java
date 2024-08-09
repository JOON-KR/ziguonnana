package com.ziguonnana.ziguserver.websocket.art.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.websocket.art.dto.RelayArt;
import com.ziguonnana.ziguserver.websocket.art.service.ArtService;
import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class ArtController {
    private final ArtService artService;
    private final String DEFAULT_IMAGE = "";
    @MessageMapping("/game/{roomId}/saveArt")
    public void relaySave(@DestinationVariable("roomId") String roomId, @Payload String art) {
        artService.save(roomId, art);
    }
    @MessageMapping("/game/{roomId}/art-start")
    @SendTo("/topic/game/{roomId}")
    public void art(@DestinationVariable("roomId") String roomId) {
    	artService.save(roomId, DEFAULT_IMAGE);
    }
    
    @MessageMapping("/game/{roomId}/avatar")
    @SendTo("/topic/game/{roomId}")
    public void avatarTest(@DestinationVariable("roomId") String roomId) {
    	artService.spreadAvatarCard(roomId);
    }
    
}
