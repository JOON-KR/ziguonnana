package com.ziguonnana.ziguserver.domain.article.video.dto;

import com.ziguonnana.ziguserver.domain.article.video.entity.VideoArticle;

import lombok.Builder;
import lombok.Getter;
@Getter
@Builder
public class VideoArticleResponse {
    private Long id;
    private String title;
    private Long videoId;
    private Long memberId;
    private Boolean isDelete;
    private Integer likeCount;
    private Integer viewCount;

    public static VideoArticleResponse from(VideoArticle videoArticle) {
        return VideoArticleResponse.builder()
                .id(videoArticle.getId())
                .title(videoArticle.getTitle())
                .videoId(videoArticle.getVideo().getId())
                .memberId(videoArticle.getMember().getId())
                .isDelete(videoArticle.getIsDelete())
                .likeCount(videoArticle.getLikeCount())
                .viewCount(videoArticle.getViewCount())
                .build();
    }
}
