package com.ziguonnana.ziguserver.websocket.art.controller;

import java.util.List;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.websocket.art.dto.Draw;
import com.ziguonnana.ziguserver.websocket.art.service.ArtService;
import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Controller
@Slf4j
public class ArtController {
    private final ArtService artService;
    private final String DEFAULT_IMAGE = "";
    @MessageMapping("/game/{roomId}/saveArt")
    public void relaySave(@DestinationVariable("roomId") String roomId, @Payload String art) {
        artService.save(roomId, art);
    }
    @MessageMapping("/game/{roomId}/art-start")
    @SendTo("/topic/game/{roomId}")
    public void art(@DestinationVariable("roomId") String roomId ) {
    	artService.start(roomId,DEFAULT_IMAGE);
    }
    
    @MessageMapping("/game/{roomId}/avatar")
    @SendTo("/topic/game/{roomId}")
    public void avatarTest(@DestinationVariable("roomId") String roomId) {
    	artService.spreadAvatarCard(roomId);
    }
    
    @MessageMapping("/game/{roomId}/draw")
    @SendTo("/topic/game/{roomId}")
    public Response<Object> draw(@DestinationVariable("roomId") String roomId, @Payload List<Draw> draw) {
        // DRAW_PREV 커맨드 타입과 받은 데이터를 Response로 감싸서 반환
    	log.info("이어그리기데이터{}",draw);
        return Response.ok(CommandType.DRAW_PREV, draw);
    }
    
}
