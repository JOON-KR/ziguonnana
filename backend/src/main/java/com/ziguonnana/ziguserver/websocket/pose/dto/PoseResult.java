package com.ziguonnana.ziguserver.websocket.pose.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class PoseResult {
	private List<List<Integer>> vector;
	private int num;
}
