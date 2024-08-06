package com.ziguonnana.ziguserver.websocket.global.controller;

import com.ziguonnana.ziguserver.websocket.global.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.websocket.global.service.WebsocketService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
@Slf4j
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
    public void joinRoom(@DestinationVariable("roomId") String roomId,@DestinationVariable("memberId") String memberId) {
    	websocketService.join(roomId, memberId);
    }

    @MessageMapping("/game/{roomId}/chat")
    @SendTo("/topic/game/{roomId}")
    public GameMessage<ChatMessage> sendMessage(@DestinationVariable("roomId") String roomId, @Payload ChatMessage chatMessage) {
        return GameMessage.info(chatMessage.getSender() + ": " + chatMessage.getContent(), chatMessage);
    }


    //  방장이 각종 게임 시작 버튼 누르면  게임 시작
    // 방에 있는 모두에게 시작 알림 => 모든 클라이언트 해당 게임 페이지로 이동
    @MessageMapping("/game/{roomId}/game-start/{gameType}")
    @SendTo("/topic/game/{roomId}/game-start")
    public GameMessage<GameType> gameStart(@DestinationVariable("roomId") String roomId, @DestinationVariable("gameType") GameType gameType) {
        log.info("=========" + gameType + " 게임 처음 시작=========");
        return GameMessage.info(gameType.getGameName() + "게임 시작", gameType);
    }
}
