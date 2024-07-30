package com.ziguonnana.ziguserver.domain.profile.dto;

import com.ziguonnana.ziguserver.domain.profile.entity.Profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileRequest {
    private String feature;
    private String profileImage;
    private Boolean isDelete;

    public static ProfileRequest from(Profile profile) {
        return ProfileRequest.builder()
                .feature(profile.getFeature())
                .profileImage(profile.getProfileImage())
                .isDelete(profile.getIsDelete())
                .build();
    }
}
