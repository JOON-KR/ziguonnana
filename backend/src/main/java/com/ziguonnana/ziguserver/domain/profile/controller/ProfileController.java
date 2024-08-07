package com.ziguonnana.ziguserver.domain.profile.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ziguonnana.ziguserver.domain.profile.dto.ProfileRequest;
import com.ziguonnana.ziguserver.domain.profile.dto.ProfileResponse;
import com.ziguonnana.ziguserver.domain.profile.service.ProfileService;
import com.ziguonnana.ziguserver.global.ResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/profile")
public class ProfileController {
	
	private final ProfileService profileService;

	@PostMapping
	public ResponseEntity<ResponseDto<ProfileResponse>> createProfile(@RequestPart MultipartFile profileImage, @RequestPart ProfileRequest profileRequest) throws IOException {
		ProfileResponse profileResponse = profileService.createProfile(profileRequest, profileImage);
		return ResponseEntity.status(201).body(ResponseDto.success(profileResponse));
	}
	
	@GetMapping("{profileId}")
	public ResponseEntity<ResponseDto<ProfileResponse>> getProfile(@PathVariable("profileId") Long profileId) {
		ProfileResponse profileResponse = profileService.getProfile(profileId);
		return ResponseEntity.status(200).body(ResponseDto.success(profileResponse));
	}
	
	@DeleteMapping("{profileId}")
	public ResponseEntity<ResponseDto<String>> deleteProfile(@PathVariable("profileId") Long profileId) {
		profileService.deleteProfile(profileId);
		return ResponseEntity.status(200).body(ResponseDto.success(""));
	}
	
	@GetMapping
	public ResponseEntity<ResponseDto<List<ProfileResponse>>> getProfileList() {
		List<ProfileResponse> profileList = profileService.getProfileList();
		return ResponseEntity.ok().body(ResponseDto.success(profileList));
	}
	
	@PutMapping
	public ResponseEntity<ResponseDto<ProfileResponse>> updateProfile(@RequestPart MultipartFile profileImage, @RequestPart ProfileRequest profileRequest) throws IOException {
		ProfileResponse profileResponse = profileService.updateProfile(profileRequest, profileImage);
		return ResponseEntity.ok().body(ResponseDto.success(profileResponse));
	}
}
