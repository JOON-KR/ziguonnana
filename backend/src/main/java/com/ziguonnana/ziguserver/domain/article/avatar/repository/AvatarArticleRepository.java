package com.ziguonnana.ziguserver.domain.article.avatar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ziguonnana.ziguserver.domain.article.avatar.entity.AvatarArticle;

public interface AvatarArticleRepository extends JpaRepository<AvatarArticle, Long> {
	
}
