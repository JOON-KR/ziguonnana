package com.ziguonnana.ziguserver.domain.profile.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.TokenInfo;
import com.ziguonnana.ziguserver.domain.member.entity.Member;
import com.ziguonnana.ziguserver.domain.member.repository.MemberRepository;
import com.ziguonnana.ziguserver.domain.profile.dto.ProfileRequest;
import com.ziguonnana.ziguserver.domain.profile.dto.ProfileResponse;
import com.ziguonnana.ziguserver.domain.profile.entity.Profile;
import com.ziguonnana.ziguserver.domain.profile.repository.ProfileRepository;
import com.ziguonnana.ziguserver.security.exception.MemberNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final MemberRepository memberRepository;
    
    public ProfileResponse createProfile(ProfileRequest req) {
        Long memberId = TokenInfo.getMemberId();
        Member member = getMember(memberId);
        Profile profile = Profile.builder()
                .member(member)
                .feature(req.getFeature())
                .profileImage(req.getProfileImage())
                .isDelete(req.getIsDelete() != null ? req.getIsDelete() : false)
                .build();

        profileRepository.save(profile);
        return ProfileResponse.from(profile);
    }

    public ProfileResponse getProfile(Long profileId) {
        Profile profile = profileRepository.findById(profileId).orElseThrow(MemberNotFoundException::new);
        return ProfileResponse.from(profile);
    }
    
    public void deleteProfile(Long profileId) {
        profileRepository.deleteById(profileId);
    }
    
    public List<ProfileResponse> getProfileList() {
        Long memberId = TokenInfo.getMemberId();
        List<Profile> profiles = profileRepository.findByMemberId(memberId).orElseThrow(MemberNotFoundException::new);
        return profiles.stream()
                .map(ProfileResponse::from)
                .collect(Collectors.toList());
    }
    
    private Member getMember(Long memberId) {
        return memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
    }
}
