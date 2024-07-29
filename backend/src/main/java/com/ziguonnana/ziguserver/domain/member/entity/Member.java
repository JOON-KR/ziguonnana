package com.ziguonnana.ziguserver.domain.member.entity;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import com.ziguonnana.ziguserver.domain.article.avatar.entity.AvatarArticle;
import com.ziguonnana.ziguserver.domain.avatar.entity.Avatar;
import com.ziguonnana.ziguserver.domain.like.entity.AvatarLike;
import com.ziguonnana.ziguserver.domain.like.entity.VideoLike;
import com.ziguonnana.ziguserver.domain.member.dto.MemberRequest;
import com.ziguonnana.ziguserver.domain.member.dto.RoleType;
import com.ziguonnana.ziguserver.domain.profile.entity.Profile;
import com.ziguonnana.ziguserver.domain.records.entity.Records;
import com.ziguonnana.ziguserver.domain.team.entity.MemberTeam;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import lombok.Builder;
import lombok.Data;

@Entity
@Data
@Builder
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
    @OneToMany(mappedBy = "member")
    private List<Profile> profiles;

    @OneToMany(mappedBy = "member")
    private List<Records> records;

    @OneToMany(mappedBy = "member")
    private List<Avatar> avatars;

    @OneToMany(mappedBy = "member")
    private List<AvatarArticle> avatarArticles;

    @OneToMany(mappedBy = "member")
    private List<AvatarLike> avatarLikes;

    @OneToMany(mappedBy = "member")
    private List<VideoLike> videoLikes;

    @OneToMany(mappedBy = "member")
    private List<MemberTeam> memberTeam;

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
