package com.ziguonnana.ziguserver.domain.article.video.repository;

import com.ziguonnana.ziguserver.domain.article.video.entity.VideoArticle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoArticleRepository extends JpaRepository<VideoArticle, Long> {
    List<VideoArticle> findAllByIsDeleteFalse();
}
