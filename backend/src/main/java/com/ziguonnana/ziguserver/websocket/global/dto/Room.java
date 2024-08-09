package com.ziguonnana.ziguserver.websocket.global.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import com.ziguonnana.ziguserver.websocket.art.dto.RelayArt;
import com.ziguonnana.ziguserver.websocket.bodytalk.dto.BodyTalkGame;
import com.ziguonnana.ziguserver.websocket.igudongseong.dto.IgudongseongResult;
import com.ziguonnana.ziguserver.websocket.shorts.dto.Shorts;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {
	//key: 클라이언트의 "num" value : Player
	private ConcurrentMap<Integer,Player> players;
	private int people;
	private int status;
	private int pose;
	private String teamName;
	private ConcurrentMap<Integer, List<RelayArt>>art;
	private int cycle;
	private int count;
	private boolean isRelay;
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
	private List<ConcurrentHashMap<Integer, String>> poseResult;
	//게임 결과 계산용 벡터 저장
	private ConcurrentMap<Integer, List<KeyPoint>>vectors;
	//이구동성 게임결과 저장용
	private List<IgudongseongResult> Igudongseong;

	//숏폼 챌린지
	private Shorts shorts;
	// 숏폼 선택 request count
	private int shortsRequestCnt;
	// 숏폼 합치기 request count;
	private int shortsMergeRequestCnt;


	public void initArt() {
		for(int i=1;i<=people;i++) {
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
		count=0;
	}
	public void cycleInit() {
		cycle=0;
	}
	public void relayEnd() {
		isRelay=true;
	}

	// 몸으로 말해요 키워드 요청 관련 함수
	public void countBodyTalkKeywordCnt(){
		bodyTalkKeywordCnt++;
	}
	public void initBodyTalkKeywordCnt(){
		bodyTalkKeywordCnt=0;
	}

	// 자기소개 문답
	public void countQuestionRequestCnt(){
		questionRequestCnt++;
	}

	// 숏폼 선택 request count 함수
	public void countShortsRequestCnt(){
		shortsRequestCnt++;
	}

	// 숏폼 합치기 request count 함수
	public void countShortsMergeRequestCnt(){
		shortsMergeRequestCnt++;
	}
}
