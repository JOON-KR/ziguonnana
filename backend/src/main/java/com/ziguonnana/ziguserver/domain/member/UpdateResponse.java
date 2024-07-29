package com.ziguonnana.ziguserver.domain.member;


import lombok.Builder;

@Builder
public record UpdateResponse(Long id, String email, String password, String name, String profileImage) {

	public static UpdateResponse create(Member member) {
		return UpdateResponse.builder()
			.id(member.getId())
			.email(member.getEmail())
			.password(member.getPassword())
			.name(member.getName())
			.profileImage(member.getProfileImage())
			.build();
	}
}
