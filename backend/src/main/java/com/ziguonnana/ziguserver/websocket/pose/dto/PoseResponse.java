package com.ziguonnana.ziguserver.websocket.pose.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PoseResponse {
	private String message;
	private int percent;
}
