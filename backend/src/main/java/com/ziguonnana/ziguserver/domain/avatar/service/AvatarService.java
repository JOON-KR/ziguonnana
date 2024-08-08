package com.ziguonnana.ziguserver.domain.avatar.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.domain.avatar.dto.AvatarRequest;
import com.ziguonnana.ziguserver.domain.avatar.dto.AvatarResponse;
import com.ziguonnana.ziguserver.domain.avatar.entity.Avatar;
import com.ziguonnana.ziguserver.domain.avatar.repository.AvatarRepository;
import com.ziguonnana.ziguserver.domain.member.entity.Member;
import com.ziguonnana.ziguserver.domain.member.repository.MemberRepository;
import com.ziguonnana.ziguserver.exception.AvatarException;
import com.ziguonnana.ziguserver.global.TokenInfo;
import com.ziguonnana.ziguserver.security.exception.MemberNotFoundException;
import com.ziguonnana.ziguserver.util.S3Util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AvatarService {

    private final AvatarRepository avatarRepository;
    private final S3Util s3Util;
    private final MemberRepository memberRepository;

    public String createAvatar(AvatarRequest request) throws IOException {
        Long memberId = TokenInfo.getMemberId();
        String path = s3Util.upload(request.image(), "avatar/" + memberId + "/");
        Avatar avatar = Avatar.builder()
                .avatarImage(path)
                .isDelete(false)
                .member(getMember(memberId))
                .avatarArticles(new ArrayList<>())
                .nickname(request.nickname())
                .feature(request.feature())
                .build();
        avatarRepository.save(avatar);
        return path;
    }

    public List<AvatarResponse> getAvatar() {
        Long memberId = TokenInfo.getMemberId();
        List<Avatar> avatars = avatarRepository.findAllByMemberId(memberId);

        if (avatars.isEmpty()) {
            throw new AvatarException("아바타를 찾을 수 없습니다.");
        }

        return avatars.stream()
                .map(avatar -> AvatarResponse.builder()
                        .image(avatar.getAvatarImage())
                        .nickname(avatar.getNickname())
                        .regDate(avatar.getRegDate())
                        .feature(avatar.getFeature())
                        .build())
                .collect(Collectors.toList());
    }

    private Member getMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException("멤버를 찾을 수 없습니다."));
    }
}
