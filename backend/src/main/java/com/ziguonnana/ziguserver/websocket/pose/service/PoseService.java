package com.ziguonnana.ziguserver.websocket.pose.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.websocket.pose.controller.PoseResult;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PoseService {
	
	private RoomRepository roomRepository;
	private final SimpMessagingTemplate messagingTemplate;
	
	public void calculate(String roomId, PoseResult request) {
		
	}
}
