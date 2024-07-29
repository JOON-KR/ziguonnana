package com.ziguonnana.ziguserver.domain.records;

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
public class Records {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String resultImage;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    private Timestamp regDate;
}
