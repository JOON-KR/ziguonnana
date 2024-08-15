package com.ziguonnana.ziguserver.domain.article.video.entity;

import java.sql.Timestamp;

import com.ziguonnana.ziguserver.domain.member.entity.Member;
import com.ziguonnana.ziguserver.domain.article.video.dto.VideoArticleRequest;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String videoUrl;

    private Timestamp regDate;
    private Boolean isDelete;
    private Integer likeCount;
    private Integer viewCount;

    private String password;
    
    @PrePersist
    protected void onCreate() {
        if (this.regDate == null) {
            this.regDate = new Timestamp(System.currentTimeMillis());
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

    public void update(VideoArticleRequest req, String videoUrl) {
        if (req.getTitle() != null) {
            this.title = req.getTitle();
        }
        if (videoUrl != null) {
            this.videoUrl = videoUrl;
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
    
    public void increaseViewCount() {
    	this.viewCount++;
    }
}
