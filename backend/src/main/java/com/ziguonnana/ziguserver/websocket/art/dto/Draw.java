package com.ziguonnana.ziguserver.websocket.art.dto;

import java.util.List;

import com.ziguonnana.ziguserver.websocket.global.dto.Position;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Draw {
    private List<Position> paths;
    private boolean drawMode;
    private String strokeColor;
    private int strokeWidth;
}