package com.ziguonnana.ziguserver.domain.avatar.entity;

import java.sql.Timestamp;
import java.util.List;

import com.ziguonnana.ziguserver.domain.article.avatar.entity.AvatarArticle;
import com.ziguonnana.ziguserver.domain.member.entity.Member;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Builder;
import lombok.Data;
@Builder
@Entity
@Data
public class Avatar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String avatarImage;
    private String nickname;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    private Timestamp regDate;
    private Boolean isDelete;
    private List<String>feature;
    private List<AvatarArticle> avatarArticles;
}
