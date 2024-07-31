package com.ziguonnana.ziguserver.domain.like.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.domain.like.repository.AvatarLikeRepository;
import com.ziguonnana.ziguserver.domain.like.repository.VideoLikeRepository;
import com.ziguonnana.ziguserver.domain.member.entity.Member;
import com.ziguonnana.ziguserver.domain.member.repository.MemberRepository;
import com.ziguonnana.ziguserver.global.TokenInfo;
import com.ziguonnana.ziguserver.security.exception.MemberNotFoundException;
import com.ziguonnana.ziguserver.domain.article.avatar.entity.AvatarArticle;
import com.ziguonnana.ziguserver.domain.article.avatar.repository.AvatarArticleRepository;
import com.ziguonnana.ziguserver.domain.article.video.entity.VideoArticle;
import com.ziguonnana.ziguserver.domain.article.video.repository.VideoArticleRepository;
import com.ziguonnana.ziguserver.domain.like.entity.AvatarLike;
import com.ziguonnana.ziguserver.domain.like.entity.VideoLike;
import com.ziguonnana.ziguserver.exception.ArticleNotFoundException;
import com.ziguonnana.ziguserver.domain.like.dto.LikeRequest;
import com.ziguonnana.ziguserver.domain.like.dto.LikeResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {

    private final AvatarLikeRepository avatarLikeRepository;
    private final VideoLikeRepository videoLikeRepository;
    private final MemberRepository memberRepository;
    private final AvatarArticleRepository avatarArticleRepository;
    private final VideoArticleRepository videoArticleRepository;

    public LikeResponse likeArticle(LikeRequest likeRequest) {
        Long memberId = TokenInfo.getMemberId();
        Member member = getMember(memberId);
        String result;

        if ("아바타".equalsIgnoreCase(likeRequest.getType())) {
            AvatarArticle avatarArticle = getAvatarArticle(likeRequest.getArticleId());
            result = handleLikeAvatar(member, avatarArticle);
        } else if ("비디오".equalsIgnoreCase(likeRequest.getType())) {
            VideoArticle videoArticle = getVideoArticle(likeRequest.getArticleId());
            result = handleLikeVideo(member, videoArticle);
        } else {
            throw new ArticleNotFoundException("게시글을 찾을 수 없습니다.");
        }

        return LikeResponse.from(likeRequest, memberId, result);
    }

    private String handleLikeAvatar(Member member, AvatarArticle avatarArticle) {
        return avatarLikeRepository.findByAvatarArticleAndMember(avatarArticle, member)
                .map(existingLike -> {
                    avatarLikeRepository.delete(existingLike);
                    avatarArticle.decreaseLikeCount(); // 좋아요 감소
                    avatarArticleRepository.save(avatarArticle); // 업데이트된 likeCount 저장
                    return "좋아요 취소";
                })
                .orElseGet(() -> {
                    AvatarLike avatarLike = AvatarLike.builder()
                            .avatarArticle(avatarArticle)
                            .member(member)
                            .build();
                    avatarLikeRepository.save(avatarLike);
                    avatarArticle.increaseLikeCount(); // 좋아요 증가
                    avatarArticleRepository.save(avatarArticle); // 업데이트된 likeCount 저장
                    return "좋아요";
                });
    }


    private String handleLikeVideo(Member member, VideoArticle videoArticle) {
        return videoLikeRepository.findByVideoArticleAndMember(videoArticle, member)
                .map(existingLike -> {
                    videoLikeRepository.delete(existingLike);
                    videoArticle.decreaseLikeCount(); // 좋아요 감소
                    videoArticleRepository.save(videoArticle); // 업데이트된 likeCount 저장
                    return "좋아요 취소";
                })
                .orElseGet(() -> {
                    VideoLike videoLike = VideoLike.builder()
                            .videoArticle(videoArticle)
                            .member(member)
                            .build();
                    videoLikeRepository.save(videoLike);
                    videoArticle.increaseLikeCount(); // 좋아요 증가
                    videoArticleRepository.save(videoArticle); // 업데이트된 likeCount 저장
                    return "좋아요";
                });
    }


    private Member getMember(Long memberId) {
        return memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
    }

    private AvatarArticle getAvatarArticle(Long articleId) {
        return avatarArticleRepository.findById(articleId)
                .orElseThrow(() -> new ArticleNotFoundException("게시글을 찾을 수 없습니다."));
    }

    private VideoArticle getVideoArticle(Long articleId) {
        return videoArticleRepository.findById(articleId)
                .orElseThrow(() -> new ArticleNotFoundException("게시글을 찾을 수 없습니다."));
    }
}
