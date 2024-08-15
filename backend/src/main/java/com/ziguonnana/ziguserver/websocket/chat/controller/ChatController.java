package com.ziguonnana.ziguserver.websocket.chat.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.websocket.chat.dto.ChatRequest;
import com.ziguonnana.ziguserver.websocket.chat.dto.ChatResponse;
import com.ziguonnana.ziguserver.websocket.chat.service.ChatService;
import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

	private final ChatService chatService;
	
    @MessageMapping("/game/{roomId}/chat")
    @SendTo("/topic/game/{roomId}/chat")
    public GameMessage<ChatResponse> sendMessage(@DestinationVariable("roomId") String roomId, @Payload ChatRequest Message) {
        ChatResponse response = chatService.spreadChat(roomId,Message);
    	return GameMessage.info("채팅 수신", response);
    }
}
