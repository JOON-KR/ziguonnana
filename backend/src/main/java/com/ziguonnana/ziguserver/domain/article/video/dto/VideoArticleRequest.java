package com.ziguonnana.ziguserver.domain.article.video.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoArticleRequest {
    private Long videoId;
    private String title;
    private Boolean isDelete;
    private Integer likeCount;
    private Integer viewCount;
    private String password;
    private Long articleId;
}
