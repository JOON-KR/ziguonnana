package com.ziguonnana.ziguserver.websocket.global.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentMap;

import com.ziguonnana.ziguserver.websocket.art.dto.RelayArt;
import com.ziguonnana.ziguserver.websocket.igudongseong.dto.IgudongseongResult;

import com.ziguonnana.ziguserver.websocket.bodytalk.dto.BodyTalkGame;
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

	//게임 결과 계산용 벡터 저장
	private ConcurrentMap<Integer, List<Double>>vectors;
	//이구동성 게임결과 저장용
	private List<IgudongseongResult> Igudongseong;


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
}
