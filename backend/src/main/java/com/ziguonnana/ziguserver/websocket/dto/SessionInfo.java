package com.ziguonnana.ziguserver.websocket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionInfo {
	private String memberId;
	private String roomId;
	private int num;
	private boolean isFull;
	
	public void full() {
		this.isFull = true;
	}
}
