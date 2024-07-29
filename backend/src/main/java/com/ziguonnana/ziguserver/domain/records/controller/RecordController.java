package com.ziguonnana.ziguserver.domain.records.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ziguonnana.ziguserver.domain.member.dto.MemberResponse;
import com.ziguonnana.ziguserver.domain.records.service.RecordService;
import com.ziguonnana.ziguserver.global.ResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Slf4j
@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/records")
public class RecordController {
	private final RecordService recordService;
	@GetMapping
	public ResponseEntity<?> getMemberRecords(){
		return ResponseEntity.status(201).body(ResponseDto.success(recordService.getRecords()));
	}
}
