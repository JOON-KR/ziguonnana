package com.ziguonnana.ziguserver.websocket.pose.controller;

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
	private List<List<Double>> vector;
	private int num;
}
