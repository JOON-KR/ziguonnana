package com.ziguonnana.ziguserver.websocket.result.dto;

import com.ziguonnana.ziguserver.websocket.art.dto.AvatarResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@Getter
@NoArgsConstructor
@Builder
public class GameResult {
    private String teamName;
    private int bodyCount;
    private long bodyDuration;
    private int igudongseongCount;
    private List<String> poseBestList;
    private List<AvatarResult> avatarCards;
    private String shortsURL; // 숏폼 최종 결과 영상 URL

    @Override
    public String toString() {
        return "GameResult{" +
                "teamName='" + teamName + '\'' +
                ", bodyCount=" + bodyCount +
                ", bodyDuration=" + bodyDuration +
                ", igudongseongCount=" + igudongseongCount +
                ", poseBestList=" + poseBestList +
                ", avatarCards=" + avatarCards +
                ", shortsURL='" + shortsURL + '\'' +
                '}';
    }
}
