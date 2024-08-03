package com.ziguonnana.ziguserver.websocket.global.dto;

import com.ziguonnana.ziguserver.domain.profile.dto.ProfileRequest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameProfile {
    private String name;
    private String[] feature;
    private String profileImage;
    
    public static GameProfile from(GameProfileRequest req) {
    	return GameProfile.builder()
    			.feature(req.getFeature())
    			.name(req.getName())
    			.profileImage(req.getProfileImage())
    			.build();
    }
}
