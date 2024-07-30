package com.ziguonnana.ziguserver.domain.profile.entity;

import java.time.LocalDateTime;

import com.ziguonnana.ziguserver.domain.member.entity.Member;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Builder;
import lombok.Data;

@Builder
@Entity
@Data
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    private String feature;
    private String profileImage;
    private LocalDateTime regDate;
    private LocalDateTime editDate;
    private Boolean isDelete;

    @PrePersist
    protected void onCreate() {
        this.regDate = LocalDateTime.now();
        this.editDate = LocalDateTime.now();
        this.isDelete = false; // 기본값 설정
    }

    @PreUpdate
    protected void onUpdate() {
        this.editDate = LocalDateTime.now();
    }
}
