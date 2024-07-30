package com.ziguonnana.ziguserver.domain.article.video.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ziguonnana.ziguserver.domain.article.video.entity.VideoArticle;

public interface VideoArticleRepository extends JpaRepository<VideoArticle, Long> {
}
