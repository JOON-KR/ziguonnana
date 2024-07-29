package com.ziguonnana.ziguserver.domain.article.video;

import java.sql.Timestamp;

import com.ziguonnana.ziguserver.domain.member.Member;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class VideoArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "video_id", nullable = false)
    private Video video;

    private Timestamp regDate;
    private Boolean isDelete;
    private Integer likeCount;
    private Integer viewCount;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
}
