package com.ziguonnana.ziguserver.websocket.nickname.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Nickname {
	private String style;
	private String nickname;
	private int num;
}
