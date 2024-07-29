package com.ziguonnana.ziguserver.security.dto;

import java.io.Serializable;

import com.ziguonnana.ziguserver.domain.member.dto.RoleType;
import com.ziguonnana.ziguserver.domain.member.entity.Member;

import lombok.Builder;

@Builder
public record CustomUserInfo(Long id, String email, String password, String name, RoleType role) implements
	Serializable {

	public static CustomUserInfo from(Member member) {
		return CustomUserInfo.builder()
			.id(member.getId())
			.email(member.getEmail())
			.password(member.getPassword())
			.name(member.getName())
			.role(member.getRole())
			.build();
	}
}
