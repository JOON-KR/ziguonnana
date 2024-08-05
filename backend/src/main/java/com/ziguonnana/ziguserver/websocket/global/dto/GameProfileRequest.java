package com.ziguonnana.ziguserver.websocket.global.dto;

import java.util.List;

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
    private List<String> feature;
    private String profileImage;
    private int num;
}
