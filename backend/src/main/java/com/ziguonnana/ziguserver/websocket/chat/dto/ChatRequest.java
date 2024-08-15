package com.ziguonnana.ziguserver.websocket.chat.dto;

import lombok.Getter;

@Getter
public class ChatRequest {
	private String content;
	private int num;
}
