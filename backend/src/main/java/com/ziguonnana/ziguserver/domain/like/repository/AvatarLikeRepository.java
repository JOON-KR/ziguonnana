package com.ziguonnana.ziguserver.domain.like.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ziguonnana.ziguserver.domain.like.entity.AvatarLike;
import com.ziguonnana.ziguserver.domain.article.avatar.entity.AvatarArticle;
import com.ziguonnana.ziguserver.domain.member.entity.Member;

public interface AvatarLikeRepository extends JpaRepository<AvatarLike, Long> {
    Optional<AvatarLike> findByAvatarArticleAndMember(AvatarArticle avatarArticle, Member member);
}
