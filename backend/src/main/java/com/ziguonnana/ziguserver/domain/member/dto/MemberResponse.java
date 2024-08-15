package com.ziguonnana.ziguserver.domain.member.dto;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import com.ziguonnana.ziguserver.domain.member.entity.Member;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MemberResponse {
	 private String email;
	 private String profileImage;
	 private String name;
	 private LocalDateTime regDate;
	 public static MemberResponse from(Member request) {
			return MemberResponse.builder()
					.email(request.getEmail())
					.name(request.getName())
					.profileImage(request.getProfileImage())
					.regDate(request.getRegDate())
					.build();
		}
}
