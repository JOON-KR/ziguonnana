package com.ziguonnana.ziguserver.domain.avatar;

import java.sql.Timestamp;
import java.util.List;

import com.ziguonnana.ziguserver.domain.article.avatar.AvatarArticle;
import com.ziguonnana.ziguserver.domain.member.Member;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Avatar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String avatarImage;
    private String nickname;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    private Timestamp regDate;
    private Boolean isDelete;

    @OneToMany(mappedBy = "avatar")
    private List<AvatarArticle> avatarArticles;
}
