package com.ziguonnana.ziguserver.websocket.art.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArtResponse {
	private String art;
	private int targetUser;
	private int currentUser;
	private String keyword;
}
