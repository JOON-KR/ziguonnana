package com.ziguonnana.ziguserver.websocket.bodytalk.controller;
import com.ziguonnana.ziguserver.websocket.bodytalk.dto.BodyChatMessage;
import com.ziguonnana.ziguserver.websocket.bodytalk.dto.BodyChatRequest;
import com.ziguonnana.ziguserver.websocket.bodytalk.dto.BodyTalkResult;
import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.bodytalk.service.BodyTalkService;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;


@Controller
@RequiredArgsConstructor
@Slf4j
public class BodyTalkController {

    private final BodyTalkService bodyTalkService;



    // 게임 한 라운드 끝나면, 출제자에게 키워드 전달
    // 다른 방 참가자들에게 키워드 타입만 전달
    @MessageMapping("/game/{roomId}/bodyTalk/keyword")
    @SendTo("/topic/game/{roomId}")
    public Response<String> sendKeyword(@DestinationVariable("roomId") String roomId) {
        log.info("========= 몸으로 말해요 게임 키워드 전달 =========");
        String type = bodyTalkService.decideKeywordExplanier(roomId);
        if(type.equals("요청 불가")) log.info("=====요청 여러번 들어옴====");
        return Response.ok(CommandType.KEYWORD_TYPE, type);
    }

    //정답 맞추는 채팅
    @MessageMapping("/game/{roomId}/bodyTalk/chat")
    @SendTo("/topic/game/{roomId}")
    public Response<BodyChatMessage> sendMessage(@DestinationVariable("roomId") String roomId, @Payload BodyChatRequest bodyChatRequest) {
        log.info("========몸으로 말해요 채팅=========");
        BodyChatMessage bodyChatMessage = bodyTalkService.chat(bodyChatRequest, roomId);
        return Response.ok(CommandType.CHAT, bodyChatMessage);
    }

    // 4분 지난 후 게임 종료 요청
    @MessageMapping("/game/{roomId}/bodyTalk/timeover")
    @SendTo("/topic/game/{roomId}")
    public Response<BodyTalkResult> sendTimeOver(@DestinationVariable("roomId") String roomId) {
        log.info("몸으로 말해요 타임 오버 요청");
        BodyTalkResult result = bodyTalkService.timeOver(roomId);
        return Response.ok(CommandType.BODYGAME_RESULT, result);
    }
}
