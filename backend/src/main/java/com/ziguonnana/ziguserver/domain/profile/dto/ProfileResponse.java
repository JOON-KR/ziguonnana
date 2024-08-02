package com.ziguonnana.ziguserver.domain.profile.dto;

import java.time.LocalDateTime;

import com.ziguonnana.ziguserver.domain.profile.entity.Profile;

import lombok.Builder;
import lombok.Getter;
@Getter
@Builder
public class ProfileResponse {
    private Long id;
    private String memberEmail;
    private String[] feature;
    private String profileImage;
    private LocalDateTime regDate;
    private LocalDateTime editDate;

    public static ProfileResponse from(Profile profile) {
        return ProfileResponse.builder()
                .id(profile.getId())
                .memberEmail(profile.getMember().getEmail())
                .feature(profile.getFeature())
                .profileImage(profile.getProfileImage())
                .regDate(profile.getRegDate())
                .editDate(profile.getEditDate())
                .build();
    }
}
