package com.ziguonnana.ziguserver.websocket.answer.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class QuestionResponse {
	private List<String>question;
	private boolean start;
}
