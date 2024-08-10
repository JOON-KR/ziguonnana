package com.ziguonnana.ziguserver.websocket.shorts.controller;

import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;
import com.ziguonnana.ziguserver.websocket.shorts.dto.ShortsInfo;
import com.ziguonnana.ziguserver.websocket.shorts.dto.ShortsResponse;
import com.ziguonnana.ziguserver.websocket.shorts.service.ShortsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.io.IOException;

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
        log.info("============ 예시 영상 선택 ==============");
        shortsService.selectVideo(roomId, shortsId);
        return Response.ok(CommandType.SHORTS_CHOICE,true);
    }

    // 해당 userNum의 숏츠 예시 영상 모두에게 전달
    @MessageMapping("/game/{roomId}/shorts/record/{userNo}")
    @SendTo("/topic/game/{roomId}")
    public Response<ShortsResponse> sendSplitVideoByUserNum(@DestinationVariable String roomId, @DestinationVariable int userNo) {
        log.info("========== " + userNo + "이 녹화할 예시 영상 요청==============");
        ShortsResponse response  = shortsService.sendSplitVideoByUserNum(roomId, userNo);
        log.info("shortsResponse : " + response);
        return Response.ok(CommandType.SHORTS_SPLITED, response);
    }

    // 비디오 합치기 요청
    // 비디오 합치기 요청되었다고 방 모두에게 전달
    @MessageMapping("/game/{roomId}/shorts/merge")
    @SendTo("/topic/game/{roomId}")
    public Response<Boolean> mergeVideo(@DestinationVariable String roomId) throws IOException {
        log.info("============ 비디오 합치기 요청 ==============");
        shortsService.mergeVideo(roomId);
        return Response.ok(CommandType.SHORTS_MERGE,true);
    }

}
