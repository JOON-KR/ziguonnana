package com.ziguonnana.ziguserver.websocket.shorts.controller;

import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;
import com.ziguonnana.ziguserver.websocket.shorts.service.ShortsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ShortsController {

    private final ShortsService shortsService;

    // 예시 영상 선택
    // 예시 영상 선택되었다고 방 모두에게 전달
    @MessageMapping("/game/{roomId}/shorts/{shortsId}")
    @SendTo("/topic/game/{roomId}")
    public Response<Boolean> selectVideo(@DestinationVariable String roomId, @DestinationVariable int shortsId) {
        shortsService.selectVideo(roomId, shortsId);
        return Response.ok(CommandType.SHORTS_CHOICE,true);
    }

}
