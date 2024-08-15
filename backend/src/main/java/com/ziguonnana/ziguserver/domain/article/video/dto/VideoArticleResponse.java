package com.ziguonnana.ziguserver.domain.article.video.dto;

import com.ziguonnana.ziguserver.domain.article.video.entity.VideoArticle;

import lombok.Builder;
import lombok.Getter;
@Getter
@Builder
public class VideoArticleResponse {
    private Long id;
    private String title;
    private String videoUrl;
    private Boolean isDelete;
    private Integer likeCount;
    private Integer viewCount;

    public static VideoArticleResponse from(VideoArticle videoArticle) {
        return VideoArticleResponse.builder()
                .id(videoArticle.getId())
                .title(videoArticle.getTitle())
                .videoUrl(videoArticle.getVideoUrl())
                .isDelete(videoArticle.getIsDelete())
                .likeCount(videoArticle.getLikeCount())
                .viewCount(videoArticle.getViewCount())
                .build();
    }
}
