package com.ziguonnana.ziguserver.domain.avatar.dto;

import java.sql.Timestamp;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AvatarResponse {
	private String image;
	private String nickname;
	private Timestamp regDate;
	private List<String>feature; 
}
