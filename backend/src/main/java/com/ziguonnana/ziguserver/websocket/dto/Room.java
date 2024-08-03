package com.ziguonnana.ziguserver.websocket.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentMap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {
	private ConcurrentMap<String,Player> players;
	private int people;
	private int status;
	private int pose;
	private String teamName;
	private ConcurrentMap<Integer, List<RelayArt>>art;
	private int cycle;
	private int count;
	private boolean isRelay;
	
	
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
