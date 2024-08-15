package com.ziguonnana.ziguserver.domain.profile.entity;

import java.time.LocalDateTime;

import com.ziguonnana.ziguserver.domain.member.entity.Member;
import com.ziguonnana.ziguserver.domain.profile.dto.ProfileRequest;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
    private String name;
    private String[] feature;
    private String profileImage;
    private LocalDateTime regDate;
    private LocalDateTime editDate;
    
    @PrePersist
    protected void onCreate() {
        this.regDate = LocalDateTime.now();
        this.editDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.editDate = LocalDateTime.now();
    }

    public void update(String[] feature, String profileImage) {
        if (feature != null) {
            this.feature = feature;
        }
        if (profileImage != null) {
            this.profileImage = profileImage;
        }
        onUpdate();
    }
    public static Profile from(ProfileRequest profile, String profileImageUrl) {
        return Profile.builder()
                .feature(profile.getFeature())
                .profileImage(profileImageUrl)
                .id(profile.getProfileId())
                .name(profile.getName())
                .build();
    }
    public String getName() {
    	return member.getName();
    }
}
