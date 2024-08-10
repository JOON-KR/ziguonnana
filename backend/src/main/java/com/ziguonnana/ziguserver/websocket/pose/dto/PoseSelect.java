package com.ziguonnana.ziguserver.websocket.pose.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PoseSelect {
	private int num;
	private int poseType;
}
