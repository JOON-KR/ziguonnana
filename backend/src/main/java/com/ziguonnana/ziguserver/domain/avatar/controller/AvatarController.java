package com.ziguonnana.ziguserver.domain.avatar.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ziguonnana.ziguserver.domain.avatar.dto.AvatarRequest;
import com.ziguonnana.ziguserver.domain.avatar.dto.AvatarResponse;
import com.ziguonnana.ziguserver.domain.avatar.service.AvatarService;
import com.ziguonnana.ziguserver.global.ResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/avatar")
public class AvatarController {
	
	private final AvatarService avatarService;
	
	@PostMapping
	ResponseEntity<ResponseDto<String>> createAvatar(@RequestPart MultipartFile image,@RequestPart AvatarRequest request) throws IOException{
		return ResponseEntity.ok(ResponseDto.success(avatarService.createAvatar(image,request)));
	}
	
	@GetMapping
	ResponseEntity<ResponseDto<List<AvatarResponse>>> getAvatar() throws IOException{
		return ResponseEntity.ok(ResponseDto.success(avatarService.getAvatar()));
	}
}
