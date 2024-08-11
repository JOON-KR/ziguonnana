package com.ziguonnana.ziguserver.domain.records.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.ziguonnana.ziguserver.domain.avatar.entity.Avatar;
import com.ziguonnana.ziguserver.domain.member.entity.Member;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Records {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    private LocalDateTime regDate;
    
    private String teamName;
    @PrePersist
    protected void onCreate() {
        this.regDate = LocalDateTime.now();
    }
    
    //몸으로 말해요 결과 : 맞은 갯수
    private int bodyCount;
    
    //몸으로 말해요 결과 : 걸린 총 시간
    private long bodyDuration;
    
    //이구동성 결과 : 성공 갯수
    private int igudongseongCount;
    
    //포즈 맞추기 결과 : 사이클 별 1등 반환
    private List<String> poseBestList;
    
    //쇼츠 결과 영상
    private String shortsURL;
    
    //아바타 명함 결과
    @OneToMany
    private List<AvatarCard> avatarCards; 
    
    //나중에 표정 쇼츠에서 찍어서 1번 전송하기 추가
}
