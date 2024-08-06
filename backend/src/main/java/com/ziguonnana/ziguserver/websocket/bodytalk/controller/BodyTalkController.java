package com.ziguonnana.ziguserver.websocket.bodytalk.controller;
import com.ziguonnana.ziguserver.websocket.bodytalk.dto.BodyResponse;
import com.ziguonnana.ziguserver.websocket.bodytalk.dto.ChatMessage;
import com.ziguonnana.ziguserver.websocket.bodytalk.dto.ChatRequest;
import com.ziguonnana.ziguserver.websocket.bodytalk.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.bodytalk.service.BodyTalkService;
import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;
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
    public BodyResponse<String> sendKeyword(@DestinationVariable("roomId") String roomId) {
        log.info("========= 몸으로 말해요 게임 키워드 전달 =========");
        String type = bodyTalkService.decideKeywordExplanier(roomId);
        return BodyResponse.ok(CommandType.KEYWORD_TYPE, type);
    }

    //정답 맞추는 채팅
    @MessageMapping("/game/{roomId}/bodyTalk/chat")
    @SendTo("/topic/game/{roomId}")
    public BodyResponse<ChatMessage> sendMessage(@DestinationVariable("roomId") String roomId, @Payload ChatRequest chatRequest) {
        log.info("========몸으로 말해요 채팅=========");
        ChatMessage chatMessage = bodyTalkService.chat(chatRequest, roomId);
        return BodyResponse.ok(CommandType.CHAT, chatMessage);
    }

}
