package com.ziguonnana.ziguserver.websocket.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {
	private List<Player> players = new ArrayList<>();
	private int people;
	private int status;
	private int pose;
	private String teamName;
}
