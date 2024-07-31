package com.ziguonnana.ziguserver.domain.article.avatar.dto;

import java.time.LocalDateTime;

import com.ziguonnana.ziguserver.domain.article.avatar.entity.AvatarArticle;

import lombok.Builder;
import lombok.Data;

@Builder
public class AvatarArticleResponse {
    private Long id;
    private String title;
    private Long avatarId;
    private LocalDateTime regDate;
    private Boolean isDelete;
    private Integer likeCount;
    private Integer viewCount;
    private Long memberId;

    public static AvatarArticleResponse from(AvatarArticle avatarArticle) {
        return AvatarArticleResponse.builder()
                .id(avatarArticle.getId())
                .title(avatarArticle.getTitle())
                .avatarId(avatarArticle.getAvatar().getId())
                .regDate(avatarArticle.getRegDate())
                .isDelete(avatarArticle.getIsDelete())
                .likeCount(avatarArticle.getLikeCount())
                .viewCount(avatarArticle.getViewCount())
                .memberId(avatarArticle.getMember().getId())
                .build();
    }
}
