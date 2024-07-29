package com.ziguonnana.ziguserver.domain.article.avatar.entity;

import java.sql.Timestamp;

import com.ziguonnana.ziguserver.domain.avatar.entity.Avatar;
import com.ziguonnana.ziguserver.domain.member.entity.Member;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class AvatarArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "avatar_id", nullable = false)
    private Avatar avatar;
    private Timestamp regDate;
    private Boolean isDelete;
    private Integer likeCount;
    private Integer viewCount;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
}
