package com.ziguonnana.ziguserver.websocket.global.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameProfileRequest {
    private String name;
    private String[] feature;
    private String profileImage;
    private String memberId;
}
