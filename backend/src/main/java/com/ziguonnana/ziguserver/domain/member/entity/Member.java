package com.ziguonnana.ziguserver.domain.member.entity;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import com.ziguonnana.ziguserver.domain.member.dto.MemberRequest;
import com.ziguonnana.ziguserver.domain.member.dto.RoleType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String profileImage;
    private String name;
    private LocalDateTime regDate;
    private Timestamp editDate;
    private Boolean isDelete;
    @Enumerated(EnumType.STRING)
	@Column(name = "ROLE", nullable = false)
	private RoleType role;

    @PrePersist
    protected void onCreate() {
        this.regDate = LocalDateTime.now();
    }
    
	public void updatePassword(String password) {
		this.password = password;
	}
	public static Member from(MemberRequest request) {
		return Member.builder()
				.email(request.email())
				.password(request.password())
				.name(request.name())
				.profileImage(request.profileImage())
				.role(RoleType.USER)
				.build();
	}

}
