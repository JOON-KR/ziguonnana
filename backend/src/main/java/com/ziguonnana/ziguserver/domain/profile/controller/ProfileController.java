package com.ziguonnana.ziguserver.domain.profile.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ziguonnana.ziguserver.domain.profile.dto.ProfileRequest;
import com.ziguonnana.ziguserver.domain.profile.dto.ProfileResponse;
import com.ziguonnana.ziguserver.domain.profile.service.ProfileService;
import com.ziguonnana.ziguserver.global.ResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/profile")
public class ProfileController {
	
	private final ProfileService profileService;

	@PostMapping
	public ResponseEntity<ResponseDto<ProfileResponse>> createProfile(@RequestBody ProfileRequest profileRequest) {
		ProfileResponse profileResponse = profileService.createProfile(profileRequest);
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
	public ResponseEntity<ResponseDto<ProfileResponse>> updateProfile(@RequestBody ProfileRequest profile){
		ProfileResponse profileResponse = profileService.updateProfile(profile);
		return ResponseEntity.ok().body(ResponseDto.success(profileResponse));
	}
}
