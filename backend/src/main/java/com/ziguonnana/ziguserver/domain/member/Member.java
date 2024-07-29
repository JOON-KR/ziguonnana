package com.ziguonnana.ziguserver.domain.member;
import java.sql.Timestamp;
import java.util.List;

import com.ziguonnana.ziguserver.domain.article.avatar.AvatarArticle;
import com.ziguonnana.ziguserver.domain.avatar.Avatar;
import com.ziguonnana.ziguserver.domain.like.AvatarLike;
import com.ziguonnana.ziguserver.domain.like.VideoLike;
import com.ziguonnana.ziguserver.domain.profile.Profile;
import com.ziguonnana.ziguserver.domain.records.Records;
import com.ziguonnana.ziguserver.domain.team.MemberTeam;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
    private Timestamp regDate;
    private Timestamp editDate;
    private Boolean isDelete;
    private Integer people;
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

	public void updatePassword(String password) {
		this.password = password;
	}

}
