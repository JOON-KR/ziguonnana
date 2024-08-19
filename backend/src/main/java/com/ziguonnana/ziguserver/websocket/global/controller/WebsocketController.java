package com.ziguonnana.ziguserver.websocket.global.controller;

import java.util.List;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.websocket.art.dto.AvatarResult;
import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.CreateRequest;
import com.ziguonnana.ziguserver.websocket.global.dto.GameProfileRequest;
import com.ziguonnana.ziguserver.websocket.global.dto.GameType;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;
import com.ziguonnana.ziguserver.websocket.global.service.WebsocketService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
    //게임끝 모달삭제용
    @MessageMapping("/game/{roomId}/end-modal")
    @SendTo("/topic/game/{roomId}")
    public Response<String> deleteModal(@DestinationVariable("roomId") String roomId){
    	log.info("=========모달 삭제===========");
    	return Response.ok(CommandType.GAME_MODAL_END, "모달 삭제");
    }
    
    @MessageMapping("/game/{roomId}/game-select")
    @SendTo("/topic/game/{roomId}")
    public Response<String> gameSelect(@DestinationVariable("roomId") String roomId) {
        log.info("========= 게임 선택 이동=========");
        return Response.ok(CommandType.NANA_MAP, "선택 화면으로 이동");
    }
    @MessageMapping("/game/{roomId}/get-avatar")
    @SendTo("/topic/game/{roomId}")
    public Response<List<AvatarResult>> getAvatar(@DestinationVariable("roomId") String roomId) {
    	log.info("========= 게임 선택 이동=========");
    	List<AvatarResult> avatarcards = websocketService.getAvatar(roomId);
    	return Response.ok(CommandType.AVATAR_IMAGE, avatarcards);
    }

    // 게임 결과 모달 띄우기
    @MessageMapping("/game/{roomId}/start-modal/result")
    @SendTo("/topic/game/{roomId}")
    public Response<Boolean> getResultModal(@DestinationVariable("roomId") String roomId){
        log.info("=========게임 결과 모달 시작===========");
        return Response.ok(CommandType.GAME_RESULT_MODAL, true);
    }

    // 포즈 따라하기 게임 종료용
    @MessageMapping("/game/{roomId}/pose/end")
    @SendTo("/topic/game/{roomId}")
    public Response<Boolean> poseEnd(@DestinationVariable("roomId") String roomId){
        log.info("포즈 따라하기 종료");
        return Response.ok(CommandType.POSE_END_TO_GAMES, true);
    }
    @MessageMapping("/game/{roomId}/skip")
    @SendTo("/topic/game/{roomId}")
    public Response<Boolean> skip(@DestinationVariable("roomId") String roomId){
    	log.info("=============스킵==============");
    	return Response.ok(CommandType.SKIP, true);
    }
    @MessageMapping("/game/{roomId}/nickname")
    @SendTo("/topic/game/{roomId}")
    public Response<Boolean> nicknameStart(@DestinationVariable("roomId") String roomId){
    	log.info("닉네임 시작");
    	return Response.ok(CommandType.NICKNAME_START, true);
    }
}
