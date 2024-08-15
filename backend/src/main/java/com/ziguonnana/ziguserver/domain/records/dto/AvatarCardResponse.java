package com.ziguonnana.ziguserver.domain.records.dto;

import java.util.List;

import com.ziguonnana.ziguserver.domain.records.entity.AvatarCard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AvatarCardResponse {
	private String avatarImage;
	private List<String> feature;
	private String nickname;
	
	public static AvatarCardResponse from(AvatarCard avatarCard) {
		return AvatarCardResponse.builder()
				.avatarImage(avatarCard.getAvatarImage())
				.feature(avatarCard.getFeature())
				.nickname(avatarCard.getNickname())
				.build();
	}
}
