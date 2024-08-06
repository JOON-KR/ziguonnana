package com.ziguonnana.ziguserver.websocket.art.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;
@Builder
@Data
public class AvatarCard {
	String avatarImage;
	List<String>feature;
}
