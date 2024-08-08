package com.ziguonnana.ziguserver.websocket.igudongseong.controller;

import java.util.List;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;
import com.ziguonnana.ziguserver.websocket.igudongseong.dto.SimilarRequest;
import com.ziguonnana.ziguserver.websocket.igudongseong.service.IgudongseongService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Controller
@Slf4j
@RequiredArgsConstructor
public class IgudongseongController {
	
	private final IgudongseongService igudongseongService;
	
	//   이구동성 키워드 리스트 반환
    @MessageMapping("/game/{roomId}/igudongseong")
    @SendTo("/topic/game/{roomId}") 
    public GameMessage<List<String>> getAnswer(@DestinationVariable("roomId") String roomId) {
        log.info("=======이구동성 시작=======");
        List<String> keyword =  igudongseongService.getKeyword(roomId);
        igudongseongService.saveKeyword(keyword,roomId);
        return GameMessage.info("이구동성 시작!", keyword);
    }
    
    @MessageMapping("/game/{roomId}/similar")
    public void getResult(@DestinationVariable("roomId") String roomId, @Payload SimilarRequest request) {
    	log.info("=======이구동성 유사도 검증=======");
    	igudongseongService.getSimilar(roomId,request);
    }
    
    @MessageMapping("/game/{roomId}/igudongseong-cycle")
    @SendTo("/topic/game/{roomId}") 
    public Response<Boolean> getResult(@DestinationVariable("roomId") String roomId) {
    	log.info("=======이구동성 cycle 시작=======");
    	return Response.ok(CommandType.IGUDONGSEONG_CYCLE, true);
    }
}
