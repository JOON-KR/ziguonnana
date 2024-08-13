package com.ziguonnana.ziguserver.websocket.global.dto;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import com.ziguonnana.ziguserver.websocket.art.dto.AvatarResult;
import com.ziguonnana.ziguserver.websocket.art.dto.RelayArt;
import com.ziguonnana.ziguserver.websocket.bodytalk.dto.BodyTalkGame;
import com.ziguonnana.ziguserver.websocket.igudongseong.dto.IgudongseongResult;
import com.ziguonnana.ziguserver.websocket.pose.dto.PoseResponse;
import com.ziguonnana.ziguserver.websocket.result.dto.GameResult;
import com.ziguonnana.ziguserver.websocket.shorts.dto.Shorts;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
public class Room {
	// key: 클라이언트의 "num" value : Player
	private ConcurrentMap<Integer, Player> players;
	private int people;
	private int status;
	private int pose;
	private String teamName;
	private ConcurrentMap<Integer, List<RelayArt>> art;
	private int cycle;
	private int count;
	private int isRelay;
	private String roomId;
	private BodyTalkGame bodyTalkGame;

	// 몸으로 말해요 키워드 요청 count
	private int bodyTalkKeywordCnt;
	// 이어그리기
	private int artRelayRequestCnt;
	// 자기소개 질문 request count
	private int questionRequestCnt;
	// 이구동성
	private int igudongseongRequestCnt;
	// 포즈맞추기
	private int poseRequestCnt;
	// 포즈맞추기 결과 저장용
	// 라운드별 결과
	// key : 몇 번 포즈타입, value : 닉네임
	private List<ConcurrentHashMap<Integer, String>> poseResult;
	private List<ConcurrentHashMap<Integer, PoseResponse>> posetmp;
	// 게임 결과 계산용 벡터 저장
	private ConcurrentMap<Integer, List<KeyPoint>> vectors;
	// 이구동성 게임결과 저장용
	private List<IgudongseongResult> Igudongseong;

	// 숏폼 챌린지
	private Shorts shorts;
	// 숏폼 선택 request count
	private int shortsRequestCnt;
	// 숏폼 합치기 request count;
	private int shortsMergeRequestCnt;
	// 숏폼 결과 URL
	private String shortsResult;
	// 아바타 명함
	private ConcurrentMap<Integer, AvatarResult> avatarcards;

	public void statusUp() {
		this.status++;
	}

	public void initArt() {
		for (int i = 1; i <= people; i++) {
			art.put(i, new ArrayList<>());
		}
		cycle = 0;
	}

	public void countUp() {
		count++;
	}

	public void cycleUp() {
		cycle++;
	}

	public void countInit() {
		count = 0;
	}

	public void cycleInit() {
		cycle = 0;
	}

	public void relayEnd() {
		isRelay++;
	}

	// 몸으로 말해요 키워드 요청 관련 함수
	public void countBodyTalkKeywordCnt() {
		bodyTalkKeywordCnt++;
	}

	public void initBodyTalkKeywordCnt() {
		bodyTalkKeywordCnt = 0;
	}

	// 자기소개 문답
	public void countQuestionRequestCnt() {
		questionRequestCnt++;
	}

	// 숏폼 선택 request count 함수
	public void countShortsRequestCnt() {
		shortsRequestCnt++;
	}

	// 숏폼 합치기 request count 함수
	public void countShortsMergeRequestCnt() {
		shortsMergeRequestCnt++;
	}

	// 숏폼 결과 set
	public void updateShortsResult(String shortsResult) {
		this.shortsResult = shortsResult;
		log.info("숏폼 결과 room에 setting");
	}

	// 게임 결과 만들기
	public GameResult makeGameResult() {
		return GameResult.builder().teamName(this.teamName).avatarCards(getAvatarcards()) // 아바타 카드 결과
				.bodyCount(this.bodyTalkGame.getCorrectCnt()) // 몸으로 말해요 결과
				.bodyDuration(this.bodyTalkGame.getDurationTime()) // 몸으로 말해요 결과
				.igudongseongCount(getIgudongseongResult()) // 이구동성 결과
//				.poseBestList()//포즈 맞추기 결과
				.shortsURL(this.shortsResult) // 숏츠 결과
				.build();
	}

	// 아바타 카드 결과
	private List<AvatarResult> getAvatarcards() {
		Collection<AvatarResult> values = avatarcards.values();
		return new ArrayList<>(values);
	}

	// 이구동성 결과 확인
	private int getIgudongseongResult() {
		int resultCnt = 0;
		for (IgudongseongResult igudongseongResult : this.Igudongseong) {
			int success = igudongseongResult.getSuccess();
			if (success == this.people) {
				resultCnt++;
			}
		}
		return resultCnt;
	}
}
