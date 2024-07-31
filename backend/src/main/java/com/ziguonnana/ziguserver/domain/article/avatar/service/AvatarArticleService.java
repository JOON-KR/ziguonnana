package com.ziguonnana.ziguserver.domain.article.avatar.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.domain.article.avatar.dto.AvatarArticleRequest;
import com.ziguonnana.ziguserver.domain.article.avatar.dto.AvatarArticleResponse;
import com.ziguonnana.ziguserver.domain.article.avatar.entity.AvatarArticle;
import com.ziguonnana.ziguserver.domain.article.avatar.repository.AvatarArticleRepository;
import com.ziguonnana.ziguserver.domain.avatar.entity.Avatar;
import com.ziguonnana.ziguserver.domain.avatar.repository.AvatarRepository;
import com.ziguonnana.ziguserver.domain.member.entity.Member;
import com.ziguonnana.ziguserver.domain.member.repository.MemberRepository;
import com.ziguonnana.ziguserver.exception.ArticleNotFoundException;
import com.ziguonnana.ziguserver.exception.AvatarNotFoundException;
import com.ziguonnana.ziguserver.global.TokenInfo;
import com.ziguonnana.ziguserver.security.exception.MemberNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AvatarArticleService {
    private final AvatarArticleRepository avatarArticleRepository;
    private final MemberRepository memberRepository;
    private final AvatarRepository avatarRepository;

    public AvatarArticleResponse createArticle(AvatarArticleRequest articleRequest) {
        Long memberId = TokenInfo.getMemberId();
        Member member = getMember(memberId);
        Avatar avatar = getAvatar(articleRequest.getAvatarId());

        AvatarArticle avatarArticle = AvatarArticle.builder()
                .member(member)
                .avatar(avatar)
                .title(articleRequest.getTitle())
                .likeCount(0)
                .viewCount(0)
                .isDelete(false)
                .build();

        avatarArticleRepository.save(avatarArticle);
        return AvatarArticleResponse.from(avatarArticle);
    }

    public AvatarArticleResponse updateArticle(AvatarArticleRequest articleRequest) {
        AvatarArticle avatarArticle = findArticleById(articleRequest.getArticleId());
        Avatar avatar = getAvatar(articleRequest.getAvatarId());

        avatarArticle.update(articleRequest, avatar);

        avatarArticleRepository.save(avatarArticle);
        return AvatarArticleResponse.from(avatarArticle);
    }

    public void deleteArticle(Long articleId) {
        Long memberId = TokenInfo.getMemberId();
        AvatarArticle avatarArticle = findArticleById(articleId);
        if (!avatarArticle.getMember().getId().equals(memberId)) {
            throw new ArticleNotFoundException("작성자가 일치하지 않습니다.");
        }
        avatarArticle.delete();
        avatarArticleRepository.save(avatarArticle);
    }

    public List<AvatarArticleResponse> getAllArticles() {
        List<AvatarArticle> articles = avatarArticleRepository.findAllByIsDeleteFalse();
        return articles.stream()
                .map(AvatarArticleResponse::from)
                .collect(Collectors.toList());
    }

    public AvatarArticleResponse getArticleById(Long articleId) {
        AvatarArticle avatarArticle = findArticleById(articleId);
        avatarArticle.increaseViewCount();
        avatarArticleRepository.save(avatarArticle);
        return AvatarArticleResponse.from(avatarArticle);
    }

    private AvatarArticle findArticleById(Long articleId) {
        return avatarArticleRepository.findById(articleId)
                .orElseThrow(() -> new ArticleNotFoundException("아바타 아티클을 찾을 수 없습니다."));
    }

    private Member getMember(Long memberId) {
        return memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
    }

    private Avatar getAvatar(Long avatarId) {
        return avatarRepository.findById(avatarId).orElseThrow(() -> new AvatarNotFoundException("아바타를 찾을 수 없습니다."));
    }
}
