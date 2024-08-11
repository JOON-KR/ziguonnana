package com.ziguonnana.ziguserver.domain.records.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.ziguonnana.ziguserver.domain.records.entity.Records;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecordsResponse {
	private Long id;
	
	private String shortsURL;
	
	private Long memberId;
	
	private LocalDateTime regDate;
	
	private String teamName;

	private int bodyCount;
	
	private long bodyDuration;
	
	private int igudongseongCount;
	
	private List<String> poseBestList;
	
	private List<AvatarCardResponse> avatarCards;

	public static RecordsResponse from(Records records) {
		return RecordsResponse.builder()
				.id(records.getId())
				.shortsURL(records.getShortsURL())
				.memberId(records.getMember().getId())
				.regDate(records.getRegDate())
				.teamName(records.getTeamName())
				.bodyCount(records.getBodyCount())
				.bodyDuration(records.getBodyDuration())
				.igudongseongCount(records.getIgudongseongCount())
				.poseBestList(records.getPoseBestList())
				.avatarCards(records.getAvatarCards().stream()
						.map(AvatarCardResponse::from)
						.collect(Collectors.toList()))
				.build();
	}
}
