package com.ziguonnana.ziguserver.domain.records.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ziguonnana.ziguserver.domain.records.dto.RecordsRequest;
import com.ziguonnana.ziguserver.domain.records.dto.RecordsResponse;
import com.ziguonnana.ziguserver.domain.records.service.RecordService;
import com.ziguonnana.ziguserver.global.ResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/records")
public class RecordController {
	private final RecordService recordService;

	@GetMapping
	public ResponseEntity<ResponseDto<List<RecordsResponse>>> getMemberRecords() {
		return ResponseEntity.ok().body(ResponseDto.success(recordService.getRecords()));
	}
	
	@PostMapping
	public ResponseEntity<ResponseDto<RecordsResponse>> createRecords(@RequestBody RecordsRequest request) {
		RecordsResponse recordsResponse = recordService.createRecords(request);
		return ResponseEntity.status(201).body(ResponseDto.success(recordsResponse));
	}
}
