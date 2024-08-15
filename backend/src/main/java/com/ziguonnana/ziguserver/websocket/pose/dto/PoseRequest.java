package com.ziguonnana.ziguserver.websocket.pose.dto;

import com.ziguonnana.ziguserver.websocket.global.dto.KeyPoint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PoseRequest {
    private int num;
    private List<KeyPoint> keypoints;
}
