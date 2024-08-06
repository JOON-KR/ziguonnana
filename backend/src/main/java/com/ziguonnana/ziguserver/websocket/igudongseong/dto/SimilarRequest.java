package com.ziguonnana.ziguserver.websocket.igudongseong.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SimilarRequest {
	List<Double> vector;
	int num;
}
