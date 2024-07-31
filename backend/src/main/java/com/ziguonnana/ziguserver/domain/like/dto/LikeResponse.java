package com.ziguonnana.ziguserver.domain.like.dto;

import lombok.Builder;
import lombok.Data;

@Builder
public class LikeResponse {
	private String type;
	private Long articleId;
	private Long memberId;
	private String result;
	
	public static LikeResponse from(LikeRequest req, Long memberId, String result) {
		return LikeResponse.builder()
				.articleId(req.getArticleId())
				.type(req.getType())
				.result(result)
				.memberId(memberId)
				.build();
	}
}
