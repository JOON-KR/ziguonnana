package com.ziguonnana.ziguserver.domain.article.avatar.dto;

import com.ziguonnana.ziguserver.domain.article.avatar.entity.AvatarArticle;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvatarArticleRequest {
    private Long avatarId;
    private String title;
    private Boolean isDelete;
    private Integer likeCount;
    private Integer viewCount;
    private Long articleId;

}
