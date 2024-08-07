package com.ziguonnana.ziguserver.websocket.art.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RelayArt {
	private String art;
	private int num; //그리는 플레이어 넘버
	private String keyword;
}
