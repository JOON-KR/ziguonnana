package com.ziguonnana.ziguserver.domain.like.dto;

import lombok.Builder;
import lombok.Getter;
@Getter
@Builder
public class LikeResponse {
	private Long articleId;
	private String result;
	
	public static LikeResponse from(LikeRequest req, Long memberId, String result) {
		return LikeResponse.builder()
				.articleId(req.getArticleId())
				.result(result)
				.build();
	}
}
