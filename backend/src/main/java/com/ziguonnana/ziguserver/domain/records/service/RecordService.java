package com.ziguonnana.ziguserver.domain.records.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.domain.member.entity.Member;
import com.ziguonnana.ziguserver.domain.member.repository.MemberRepository;
import com.ziguonnana.ziguserver.domain.records.dto.RecordsRequest;
import com.ziguonnana.ziguserver.domain.records.dto.RecordsResponse;
import com.ziguonnana.ziguserver.domain.records.entity.AvatarCard;
import com.ziguonnana.ziguserver.domain.records.entity.Records;
import com.ziguonnana.ziguserver.domain.records.repository.RecordRepository;
import com.ziguonnana.ziguserver.exception.RecordNotFoundException;
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

    public List<RecordsResponse> getRecords() {
        Long memberId = TokenInfo.getMemberId();
        List<Records> recordsList = recordRepository.findByMemberId(memberId).orElseThrow(RecordNotFoundException::new);
        return recordsList.stream()
                .map(RecordsResponse::from)
                .collect(Collectors.toList());
    }

    public RecordsResponse createRecords(RecordsRequest request) {
        Long memberId = TokenInfo.getMemberId();
        Member member = getMember(memberId);

        // 아바타 명함 생성
        List<AvatarCard> avatarCards = request.getAvatarCards().stream()
                .map(avatarResult -> AvatarCard.builder()
                        .avatarImage(avatarResult.getAvatarImage())
                        .feature(avatarResult.getFeature())
                        .nickname(avatarResult.getNickname())
                        .records(null) // 나중에 연관관계를 설정하기 위해 null로 초기화
                        .build())
                .collect(Collectors.toList());

        // Records 엔티티 생성
        Records records = Records.builder()
                .member(member)
                .teamName(request.getTeamName())
                .bodyCount(request.getBodyCount())
                .bodyDuration(request.getBodyDuration())
                .igudongseongCount(request.getIgudongseongCount())
                .poseBestList(request.getPoseBestList())
                .shortsURL(request.getShortsURL())
                .avatarCards(avatarCards) // AvatarCards 리스트 설정
                .build();

        // AvatarCard와 Records 간의 연관관계를 설정
        avatarCards.forEach(avatarCard -> avatarCard.setRecords(records));

        // Records 저장
        recordRepository.save(records);

        // Response 변환 및 반환
        return RecordsResponse.from(records);
    }

    private Member getMember(Long memberId) {
        return memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
    }
}
