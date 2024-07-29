package com.ziguonnana.ziguserver.domain.like;

import com.ziguonnana.ziguserver.domain.article.video.VideoArticle;
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
public class VideoLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "video_id", nullable = false)
    private VideoArticle videoArticle;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
}
