package com.ziguonnana.ziguserver.websocket.result.dto;

import java.util.List;

import com.ziguonnana.ziguserver.websocket.art.dto.AvatarResult;
import com.ziguonnana.ziguserver.websocket.pose.dto.PoseResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Getter
@NoArgsConstructor
@Builder
public class GameResult {
    private String teamName;
    private int bodyCount;
    private long bodyDuration;
    private int igudongseongCount;
    private String poseBest;
    private List<AvatarResult> avatarCards;
    private String shortsURL; // 숏폼 최종 결과 영상 URL
    private int people; // 인원수

    @Override
    public String toString() {
        return "GameResult{" +
                "teamName='" + teamName + '\'' +
                ", bodyCount=" + bodyCount +
                ", bodyDuration=" + bodyDuration +
                ", igudongseongCount=" + igudongseongCount +
                ", poseBest=" + poseBest +
                ", avatarCards=" + avatarCards +
                ", shortsURL='" + shortsURL + '\'' +
                '}';
    }
}
