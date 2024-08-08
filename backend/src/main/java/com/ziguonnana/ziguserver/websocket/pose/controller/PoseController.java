package com.ziguonnana.ziguserver.websocket.pose.controller;

import org.springframework.stereotype.Controller;

import com.ziguonnana.ziguserver.websocket.pose.service.PoseService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class PoseController {
	
	private PoseService poseService;
	
}