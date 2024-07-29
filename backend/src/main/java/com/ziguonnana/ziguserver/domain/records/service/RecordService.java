package com.ziguonnana.ziguserver.domain.records.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.TokenInfo;
import com.ziguonnana.ziguserver.domain.records.entity.Records;
import com.ziguonnana.ziguserver.domain.records.repository.RecordRepository;
import com.ziguonnana.ziguserver.security.exception.MemberNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class RecordService {
	private final RecordRepository recordRepository;
	public List<Records> getRecords(){
		Long memberId = TokenInfo.getMemberId();
		return recordRepository.findByMemberId(memberId).orElseThrow(MemberNotFoundException::new);
	}
}
