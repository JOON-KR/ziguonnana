package com.ziguonnana.ziguserver.websocket.global.dto;

import java.util.List;

import com.ziguonnana.ziguserver.domain.avatar.entity.Avatar;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {
	private String role;
	private String memberId;
	private String roomId;
	private List<String>answer;
	private GameProfile profile;
	private Avatar avatar;
	private String nickName;
	private String emotionImage;
	private double[] vector;
	private int num;
	public void createProfile(GameProfile profile) {
		this.profile = profile;
	}
}
