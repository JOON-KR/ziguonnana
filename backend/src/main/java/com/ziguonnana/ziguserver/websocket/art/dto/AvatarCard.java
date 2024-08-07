package com.ziguonnana.ziguserver.websocket.art.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvatarCard {
	String avatarImage;
	List<String>feature;
}
