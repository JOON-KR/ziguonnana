package com.ziguonnana.ziguserver.domain.records.dto;

import java.time.LocalDateTime;

import com.ziguonnana.ziguserver.domain.records.entity.Records;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecordsResponse {
	private Long id;
	
	private String resultImage;
	
	private Long memberId;
	
	private LocalDateTime regDate;
	
	private String teamName;
	public static RecordsResponse from(Records records) {
		return RecordsResponse.builder()
				.id(records.getId())
				.resultImage(records.getResultImage())
				.memberId(records.getMember().getId())
				.regDate(records.getRegDate())
				.teamName(records.getTeamName())
				.build();
	}
}
