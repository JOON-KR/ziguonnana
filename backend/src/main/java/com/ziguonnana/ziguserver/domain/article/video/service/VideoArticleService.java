package com.ziguonnana.ziguserver.domain.article.video.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.domain.article.video.dto.VideoArticleRequest;
import com.ziguonnana.ziguserver.domain.article.video.dto.VideoArticleResponse;
import com.ziguonnana.ziguserver.domain.article.video.entity.VideoArticle;
import com.ziguonnana.ziguserver.domain.article.video.repository.VideoArticleRepository;
import com.ziguonnana.ziguserver.exception.ArticleNotFoundException;
import com.ziguonnana.ziguserver.exception.VideoNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class VideoArticleService {
    private final VideoArticleRepository videoArticleRepository;
    private final PasswordEncoder encoder;
    public VideoArticleResponse createArticle(VideoArticleRequest articleRequest) {
        VideoArticle videoArticle = VideoArticle.builder()
                .videoUrl(articleRequest.getVideoUrl())
                .title(articleRequest.getTitle())
                .likeCount(0)
                .viewCount(0)
                .password(encoder.encode(articleRequest.getPassword()))
                .isDelete(false)
                .build();

        videoArticleRepository.save(videoArticle);
        return VideoArticleResponse.from(videoArticle);
    }

    public VideoArticleResponse updateArticle(VideoArticleRequest articleRequest) {
        VideoArticle videoArticle = findArticleById(articleRequest.getArticleId());
        String encodedPassword = encoder.encode(articleRequest.getPassword());
        if (!videoArticle.getPassword().equals(encodedPassword)) {
            throw new ArticleNotFoundException("비밀번호가 일치하지 않습니다.");
        }



        videoArticleRepository.save(videoArticle);
        return VideoArticleResponse.from(videoArticle);
    }

    public void deleteArticle(Long articleId) {
        VideoArticle videoArticle = findArticleById(articleId);
        String encodedPassword = encoder.encode(videoArticle.getPassword());
        if (!videoArticle.getPassword().equals(encodedPassword)) {
            throw new ArticleNotFoundException("비밀번호가 일치하지 않습니다.");
        }

        videoArticle.delete();
        videoArticleRepository.save(videoArticle);
    }

    public List<VideoArticleResponse> getAllArticles() {
        List<VideoArticle> articles = videoArticleRepository.findAllByIsDeleteFalse();
        return articles.stream()
                .map(VideoArticleResponse::from)
                .collect(Collectors.toList());
    }

    public VideoArticleResponse getArticleById(Long articleId) {
        VideoArticle videoArticle = findArticleById(articleId);
        videoArticle.increaseViewCount();
        videoArticleRepository.save(videoArticle);
        return VideoArticleResponse.from(videoArticle);
    }

    private VideoArticle findArticleById(Long articleId) {
        return videoArticleRepository.findById(articleId)
                .orElseThrow(() -> new ArticleNotFoundException("비디오 아티클을 찾을 수 없습니다."));
    }

}
