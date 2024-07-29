package com.ziguonnana.ziguserver.domain.profile;

import java.sql.Timestamp;

import com.ziguonnana.ziguserver.domain.member.Member;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

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
    private Timestamp regDate;
    private Timestamp editDate;
    private Boolean isDelete;
}

