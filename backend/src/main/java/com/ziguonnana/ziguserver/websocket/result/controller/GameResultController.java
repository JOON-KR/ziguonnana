package com.ziguonnana.ziguserver.websocket.result.controller;

import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;
import com.ziguonnana.ziguserver.websocket.result.dto.GameResult;
import com.ziguonnana.ziguserver.websocket.result.service.GameResultService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
@RequiredArgsConstructor
public class GameResultController {

    private final GameResultService gameResultService;

    // 게임 결과 요청 및 응답
    @MessageMapping("/game/{roomId}/result")
    @SendTo("/topic/game/{roomId}")
    public Response<GameResult> getGameResult(@DestinationVariable("roomId") String roomId) {
        log.info("========= 게임 결과 요청 =========");
        GameResult result = gameResultService.getGameResult(roomId);
        log.info("====게임 결과 : " + result);
        return Response.ok(CommandType.GAME_RESULT, result);
    }
}
