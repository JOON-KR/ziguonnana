package com.ziguonnana.ziguserver.domain.like.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeRequest {
	private Long articleId;
	private String type; //아바타 또는 비디오
}
