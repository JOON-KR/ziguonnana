package com.ziguonnana.ziguserver.websocket.dto;

import java.util.List;

import com.ziguonnana.ziguserver.domain.avatar.entity.Avatar;
import com.ziguonnana.ziguserver.domain.profile.entity.Profile;

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
	private Profile profile;
	private Avatar avatar;
	private String nickName;
	private String emotionImage;
	private double[] vector;
}
