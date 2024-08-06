package com.ziguonnana.ziguserver.domain.article.video.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ziguonnana.ziguserver.domain.article.video.dto.VideoArticleRequest;
import com.ziguonnana.ziguserver.domain.article.video.dto.VideoArticleResponse;
import com.ziguonnana.ziguserver.domain.article.video.service.VideoArticleService;
import com.ziguonnana.ziguserver.global.ResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/article/video")
public class VideoArticleController {

    private final VideoArticleService videoArticleService;

    @PostMapping
    public ResponseEntity<ResponseDto<VideoArticleResponse>> createArticle(@RequestBody VideoArticleRequest articleRequest) {
        VideoArticleResponse response = videoArticleService.createArticle(articleRequest);
        return ResponseEntity.status(201).body(ResponseDto.success(response));
    }

    @PutMapping
    public ResponseEntity<ResponseDto<VideoArticleResponse>> updateArticle(@RequestBody VideoArticleRequest articleRequest) {
        VideoArticleResponse response = videoArticleService.updateArticle(articleRequest);
        return ResponseEntity.ok(ResponseDto.success(response));
    }

    @DeleteMapping("/{articleId}")
    public ResponseEntity<ResponseDto<String>> deleteArticle(@PathVariable("articleId") Long articleId) {
        videoArticleService.deleteArticle(articleId);
        return ResponseEntity.ok(ResponseDto.success("비디오 아티클 삭제완료"));
    }

    @GetMapping
    public ResponseEntity<ResponseDto<List<VideoArticleResponse>>> getAllArticles() {
        List<VideoArticleResponse> response = videoArticleService.getAllArticles();
        return ResponseEntity.ok(ResponseDto.success(response));
    }

    @GetMapping("/{articleId}")
    public ResponseEntity<ResponseDto<VideoArticleResponse>> getArticleById(@PathVariable("articleId") Long articleId) {
        VideoArticleResponse response = videoArticleService.getArticleById(articleId);
        return ResponseEntity.ok(ResponseDto.success(response));
    }
}
