package com.ziguonnana.ziguserver.domain.profile.dto;

import java.time.LocalDateTime;

import com.ziguonnana.ziguserver.domain.profile.entity.Profile;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {
    private Integer id;
    private String memberEmail;
    private String feature;
    private String profileImage;
    private LocalDateTime regDate;
    private LocalDateTime editDate;
    private Boolean isDelete;

    public static ProfileResponse from(Profile profile) {
        return ProfileResponse.builder()
                .id(profile.getId())
                .memberEmail(profile.getMember().getEmail())
                .feature(profile.getFeature())
                .profileImage(profile.getProfileImage())
                .regDate(profile.getRegDate())
                .editDate(profile.getEditDate())
                .isDelete(profile.getIsDelete())
                .build();
    }
}
