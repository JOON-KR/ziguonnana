package com.ziguonnana.ziguserver.websocket.igudongseong.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IgudongseongResult {
	int Success;
	String keyword;
	
	public void updateSuccess(int Success) {
		this.Success =Success;
	}
}
