package com.ziguonnana.ziguserver.domain.article.avatar.entity;

import java.time.LocalDateTime;

import com.ziguonnana.ziguserver.domain.avatar.entity.Avatar;
import com.ziguonnana.ziguserver.domain.member.entity.Member;
import com.ziguonnana.ziguserver.domain.article.avatar.dto.AvatarArticleRequest;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.Builder;
import lombok.Data;

@Builder
@Entity
@Data
public class AvatarArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "avatar_id", nullable = false)
    private Avatar avatar;

    private LocalDateTime regDate;
    private Boolean isDelete;
    private Integer likeCount;
    private Integer viewCount;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @PrePersist
    protected void onCreate() {
        if (this.regDate == null) {
            this.regDate = LocalDateTime.now();
        }
        if (this.isDelete == null) {
            this.isDelete = false;
        }
        if (this.likeCount == null) {
            this.likeCount = 0;
        }
        if (this.viewCount == null) {
            this.viewCount = 0;
        }
    }

    public void update(AvatarArticleRequest req, Avatar avatar) {
        if (req.getTitle() != null) {
            this.title = req.getTitle();
        }
        if (avatar != null) {
            this.avatar = avatar;
        }
        if (req.getIsDelete() != null) {
            this.isDelete = req.getIsDelete();
        }
        if (req.getLikeCount() != null) {
            this.likeCount = req.getLikeCount();
        }
        if (req.getViewCount() != null) {
            this.viewCount = req.getViewCount();
        }
    }

    public void delete() {
        this.isDelete = true;
    }
    public void increaseLikeCount() {
        this.likeCount++;
    }

    public void decreaseLikeCount() {
        this.likeCount--;
    }
}
