package com.ziguonnana.ziguserver.websocket.igudongseong.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IgudongseongResult {
	int Success;
	String keyword;
	
	public void updateSuccess(int Success) {
		this.Success =Success;
	}
}
