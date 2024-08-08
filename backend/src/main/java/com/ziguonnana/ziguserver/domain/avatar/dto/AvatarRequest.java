package com.ziguonnana.ziguserver.domain.avatar.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public record AvatarRequest(MultipartFile image, List<String>feature, String nickname) {

}
