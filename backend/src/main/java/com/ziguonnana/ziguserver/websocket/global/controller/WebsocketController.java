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

    //  방장이 각종 게임 시작 버튼 누르면  게임 시작
    // 방에 있는 모두에게 시작 알림 => 모든 클라이언트 해당 게임 페이지로 이동
    @MessageMapping("/game/{roomId}/game-start/{gameType}")
    @SendTo("/topic/game/{roomId}")
    public Response<GameType> gameStart(@DestinationVariable("roomId") String roomId, @DestinationVariable("gameType") GameType gameType) {
        log.info("=========" + gameType + " 게임 처음 시작=========");
        return Response.ok(CommandType.CHOICE, gameType);
    }

    //게임 시작 모달 삭제용
    @MessageMapping("/game/{roomId}/start-modal/{gameType}")
    @SendTo("/topic/game/{roomId}")
    public Response<GameType> bodyTalkStart(@DestinationVariable("roomId") String roomId, @DestinationVariable("gameType") GameType gameType){
        log.info("=========" + gameType + "게임 모달 시작===========");
        return Response.ok(CommandType.GAME_MODAL_START, gameType);
    }
    
    @MessageMapping("/game/{roomId}/game-select")
    @SendTo("/topic/game/{roomId}")
    public Response<String> gameSelect(@DestinationVariable("roomId") String roomId) {
        log.info("========= 게임 선택 이동=========");
        return Response.ok(CommandType.NANA_MAP, "선택 화면으로 이동");
    }
}
