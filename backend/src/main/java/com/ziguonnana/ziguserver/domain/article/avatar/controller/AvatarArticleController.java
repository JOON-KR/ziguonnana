package com.ziguonnana.ziguserver.domain.article.avatar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ziguonnana.ziguserver.domain.article.avatar.dto.AvatarArticleRequest;
import com.ziguonnana.ziguserver.domain.article.avatar.dto.AvatarArticleResponse;
import com.ziguonnana.ziguserver.domain.article.avatar.service.AvatarArticleService;
import com.ziguonnana.ziguserver.global.ResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/article/avatar")
public class AvatarArticleController {

    private final AvatarArticleService avatarArticleService;

    @PostMapping
    public ResponseEntity<ResponseDto<AvatarArticleResponse>> createArticle(@RequestBody AvatarArticleRequest articleRequest) {
        AvatarArticleResponse response = avatarArticleService.createArticle(articleRequest);
        return ResponseEntity.status(201).body(ResponseDto.success(response));
    }

    @PutMapping
    public ResponseEntity<ResponseDto<AvatarArticleResponse>> updateArticle(@RequestBody AvatarArticleRequest articleRequest) {
        AvatarArticleResponse response = avatarArticleService.updateArticle(articleRequest);
        return ResponseEntity.ok(ResponseDto.success(response));
    }

    @DeleteMapping("/{articleId}")
    public ResponseEntity<ResponseDto<String>> deleteArticle(@PathVariable("articleId") Long articleId) {
        avatarArticleService.deleteArticle(articleId);
        return ResponseEntity.ok(ResponseDto.success("아바타 아티클 삭제완료"));
    }

    @GetMapping
    public ResponseEntity<ResponseDto<List<AvatarArticleResponse>>> getAllArticles() {
        List<AvatarArticleResponse> response = avatarArticleService.getAllArticles();
        return ResponseEntity.ok(ResponseDto.success(response));
    }

    @GetMapping("/{articleId}")
    public ResponseEntity<ResponseDto<AvatarArticleResponse>> getArticleById(@PathVariable("articleId") Long articleId) {
        AvatarArticleResponse response = avatarArticleService.getArticleById(articleId);
        return ResponseEntity.ok(ResponseDto.success(response));
    }
}
