package com.ziguonnana.ziguserver.domain.records.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.domain.member.entity.Member;
import com.ziguonnana.ziguserver.domain.member.repository.MemberRepository;
import com.ziguonnana.ziguserver.domain.records.dto.RecordsRequest;
import com.ziguonnana.ziguserver.domain.records.dto.RecordsResponse;
import com.ziguonnana.ziguserver.domain.records.entity.Records;
import com.ziguonnana.ziguserver.domain.records.repository.RecordRepository;
import com.ziguonnana.ziguserver.global.TokenInfo;
import com.ziguonnana.ziguserver.security.exception.MemberNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class RecordService {
	private final RecordRepository recordRepository;
	private final MemberRepository memberRepository;
	
	
	public List<Records> getRecords() {
		Long memberId = TokenInfo.getMemberId();
		return recordRepository.findByMemberId(memberId).orElseThrow(MemberNotFoundException::new);
	}

	public RecordsResponse createRecords(RecordsRequest recordsRequest) {
		Long memberId = TokenInfo.getMemberId();
		Member member = getMember(memberId);

		Records records = Records.builder()
				.resultImage(recordsRequest.getResultImage())
				.member(member)
				.teamName(recordsRequest.getTeamName())
				.build();
				
		recordRepository.save(records);
		return RecordsResponse.from(records);
	}

	private Member getMember(Long memberId) {
		return memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
	}
}
