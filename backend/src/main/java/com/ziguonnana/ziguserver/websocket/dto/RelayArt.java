package com.ziguonnana.ziguserver.websocket.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RelayArt {
	private Byte art;
	private int num; //그리는 플레이어 넘버
}
