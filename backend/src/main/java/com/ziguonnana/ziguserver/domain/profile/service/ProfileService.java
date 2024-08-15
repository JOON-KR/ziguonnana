package com.ziguonnana.ziguserver.domain.profile.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import com.ziguonnana.ziguserver.util.S3Util;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.domain.member.entity.Member;
import com.ziguonnana.ziguserver.domain.member.repository.MemberRepository;
import com.ziguonnana.ziguserver.domain.profile.dto.ProfileRequest;
import com.ziguonnana.ziguserver.domain.profile.dto.ProfileResponse;
import com.ziguonnana.ziguserver.domain.profile.entity.Profile;
import com.ziguonnana.ziguserver.domain.profile.repository.ProfileRepository;
import com.ziguonnana.ziguserver.global.TokenInfo;
import com.ziguonnana.ziguserver.security.exception.MemberNotFoundException;
import com.ziguonnana.ziguserver.exception.ProfileNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final MemberRepository memberRepository;
    private final S3Util s3Util;
    
    public ProfileResponse createProfile(ProfileRequest req, MultipartFile profileImage) throws IOException {
        Long memberId = TokenInfo.getMemberId();
        Member member = getMember(memberId);
        String uploadedProfileImage = s3Util.upload(profileImage, "profile/" + memberId + "/");
        Profile profile = Profile.builder()
                .member(member)
                .feature(req.getFeature())
                .profileImage(uploadedProfileImage)
                .build();

        profileRepository.save(profile);
        return ProfileResponse.from(profile);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Long profileId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ProfileNotFoundException("프로필을 찾을 수 없습니다."));
        return ProfileResponse.from(profile);
    }

    public ProfileResponse updateProfile(ProfileRequest req, MultipartFile profileImage) throws IOException {
        Profile profile = profileRepository.findById(req.getProfileId())
                .orElseThrow(() -> new ProfileNotFoundException("프로필을 찾을 수 없습니다."));
        // s3에서 기존 이미지 삭제
        s3Util.deleteImageFromS3(profile.getProfileImage());
        // 새로운 이미지 업로드
        String uploadedProfileImage = s3Util.upload(profileImage, "profile/" + profile.getMember().getId() + "/");
        profile.update(req.getFeature(), uploadedProfileImage);
        profileRepository.save(profile);
        return ProfileResponse.from(profile);
    }
    
    public void deleteProfile(Long profileId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ProfileNotFoundException("프로필을 찾을 수 없습니다."));
        //s3에서 프로필 이미지 삭제
        s3Util.deleteImageFromS3(profile.getProfileImage());
        profileRepository.deleteById(profileId);
    }

    @Transactional(readOnly = true)
    public List<ProfileResponse> getProfileList() {
        Long memberId = TokenInfo.getMemberId();
        List<Profile> profiles = profileRepository.findByMemberId(memberId)
                .orElseThrow(() -> new MemberNotFoundException("멤버를 찾을 수 없습니다."));
        return profiles.stream()
                .map(ProfileResponse::from)
                .collect(Collectors.toList());
    }

    private Member getMember(Long memberId) {
        return memberRepository.findById(memberId).orElseThrow(() -> new MemberNotFoundException("멤버를 찾을 수 없습니다."));
    }
}
