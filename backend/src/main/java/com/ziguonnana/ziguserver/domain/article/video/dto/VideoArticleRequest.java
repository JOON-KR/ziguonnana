package com.ziguonnana.ziguserver.domain.article.video.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoArticleRequest {
    private Long videoId;
    private String title;
    private Boolean isDelete;
    private Integer likeCount;
    private Integer viewCount;
    private Long memberId;
    private Long articleId;
}
