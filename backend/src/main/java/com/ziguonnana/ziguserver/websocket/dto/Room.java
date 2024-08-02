package com.ziguonnana.ziguserver.websocket.dto;

import java.util.concurrent.ConcurrentHashMap;
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
}
