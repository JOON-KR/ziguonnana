package com.ziguonnana.ziguserver.domain.like.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ziguonnana.ziguserver.domain.like.dto.LikeRequest;
import com.ziguonnana.ziguserver.domain.like.dto.LikeResponse;
import com.ziguonnana.ziguserver.domain.like.service.LikeService;
import com.ziguonnana.ziguserver.global.ResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/article/like")
public class LikeController {
	
	private final LikeService likeService;
	
	@PostMapping
	public ResponseEntity<ResponseDto<LikeResponse>> likeArticle(@RequestBody LikeRequest likeRequest){
		LikeResponse response = likeService.likeArticle(likeRequest);
		return ResponseEntity.ok().body(ResponseDto.success(response));
	}
}
