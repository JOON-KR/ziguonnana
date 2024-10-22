package com.ziguonnana.ziguserver.websocket.global.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameMessage<T> {
	private String message;
	private T data;
	
	public static <T> GameMessage<T> join(String name, T data) {
		return new GameMessage<>(name+"님이 입장하였습니다.",data);
	}
	
	public static <T> GameMessage<T> info(String message, T data){
		return new GameMessage<>(message+"\n",data);
	}
	
}
