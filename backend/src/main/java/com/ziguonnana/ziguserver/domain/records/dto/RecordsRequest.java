package com.ziguonnana.ziguserver.domain.records.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecordsRequest {
    private String teamName;
    private int bodyCount;
    private long bodyDuration;
    private int igudongseongCount;
    private List<String> poseBestList;
    private List<AvatarResultRequest> avatarCards;
    private String shortsURL; // 숏폼 최종 결과 영상 URL

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AvatarResultRequest {
        private String avatarImage;
        private List<String> feature;
        private String nickname;
    }
}
