package com.ziguonnana.ziguserver.domain.like.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ziguonnana.ziguserver.domain.like.entity.VideoLike;
import com.ziguonnana.ziguserver.domain.article.video.entity.VideoArticle;
import com.ziguonnana.ziguserver.domain.member.entity.Member;

public interface VideoLikeRepository extends JpaRepository<VideoLike, Long> {
    Optional<VideoLike> findByVideoArticleAndMember(VideoArticle videoArticle, Member member);
}
