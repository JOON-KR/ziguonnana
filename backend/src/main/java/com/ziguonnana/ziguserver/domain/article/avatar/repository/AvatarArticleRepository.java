package com.ziguonnana.ziguserver.domain.article.avatar.repository;

import com.ziguonnana.ziguserver.domain.article.avatar.entity.AvatarArticle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvatarArticleRepository extends JpaRepository<AvatarArticle, Long> {
    List<AvatarArticle> findAllByIsDeleteFalse();
}
