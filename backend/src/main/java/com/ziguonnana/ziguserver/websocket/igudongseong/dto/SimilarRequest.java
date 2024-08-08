package com.ziguonnana.ziguserver.websocket.igudongseong.dto;

import java.util.List;

import com.ziguonnana.ziguserver.websocket.global.dto.KeyPoint;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimilarRequest {
	private int num;
	private List<KeyPoint> keypoints;
}
