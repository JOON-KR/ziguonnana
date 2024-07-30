package com.ziguonnana.ziguserver.domain.article.video.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ziguonnana.ziguserver.domain.article.video.entity.Video;

public interface VideoRepository extends JpaRepository<Video, Long> {
}
