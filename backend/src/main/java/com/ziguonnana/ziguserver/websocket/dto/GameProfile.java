package com.ziguonnana.ziguserver.websocket.dto;

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
}
