package com.ziguonnana.ziguserver.domain.like.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.domain.article.video.entity.VideoArticle;
import com.ziguonnana.ziguserver.domain.article.video.repository.VideoArticleRepository;
import com.ziguonnana.ziguserver.domain.like.dto.LikeResponse;
import com.ziguonnana.ziguserver.domain.like.entity.VideoLike;
import com.ziguonnana.ziguserver.domain.like.repository.VideoLikeRepository;
import com.ziguonnana.ziguserver.exception.ArticleNotFoundException;

import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {

    private final VideoLikeRepository videoLikeRepository;
    private final VideoArticleRepository videoArticleRepository;
    private final HttpServletRequest request;

    public LikeResponse likeArticle(Long articleId) {
        String ipAddress = extractIpAddress(request);
        VideoArticle videoArticle = getVideoArticle(articleId);
        String result = handleLikeVideo(ipAddress, videoArticle);
        return LikeResponse.builder()
                .articleId(articleId)
                .result(result)
                .build();
    }

    private VideoArticle getVideoArticle(Long articleId) {
        return videoArticleRepository.findById(articleId)
                .orElseThrow(() -> new ArticleNotFoundException("비디오 게시글을 찾을 수 없습니다."));
    }

    private String handleLikeVideo(String ipAddress, VideoArticle videoArticle) {
        return videoLikeRepository.findByVideoArticleIdAndIpAddress(videoArticle.getId(), ipAddress)
                .map(existingLike -> {
                    videoLikeRepository.delete(existingLike);
                    videoArticle.decreaseLikeCount(); // 좋아요 감소
                    videoArticleRepository.save(videoArticle); // 업데이트된 likeCount 저장
                    return "좋아요 취소 : "+ipAddress;
                })
                .orElseGet(() -> {
                    VideoLike videoLike = VideoLike.builder()
                            .videoArticle(videoArticle)
                            .ipAddress(ipAddress)
                            .build();
                    videoLikeRepository.save(videoLike);
                    videoArticle.increaseLikeCount(); // 좋아요 증가
                    videoArticleRepository.save(videoArticle); // 업데이트된 likeCount 저장
                    return "좋아요 : "+ipAddress;
                });
    }

    private String extractIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }
}

//    public LikeResponse likeArticle(LikeRequest likeRequest) {
//        Long memberId = TokenInfo.getMemberId();
//        Member member = getMember(memberId);
//        String result;
//        if ("아바타".equalsIgnoreCase(likeRequest.getType())) {
//            AvatarArticle avatarArticle = getAvatarArticle(likeRequest.getArticleId());
//            result = handleLikeAvatar(member, avatarArticle);
//        } else if ("비디오".equalsIgnoreCase(likeRequest.getType())) {
//            VideoArticle videoArticle = getVideoArticle(likeRequest.getArticleId());
//            result = handleLikeVideo(member, videoArticle);
//        } else {
//            throw new ArticleNotFoundException("게시글을 찾을 수 없습니다.");
//        }
//
//        return LikeResponse.from(likeRequest, memberId, result);
//    }
//
//    private String handleLikeAvatar(Member member, AvatarArticle avatarArticle) {
//        return avatarLikeRepository.findByAvatarArticleAndMember(avatarArticle, member)
//                .map(existingLike -> {
//                    avatarLikeRepository.delete(existingLike);
//                    avatarArticle.decreaseLikeCount(); // 좋아요 감소
//                    avatarArticleRepository.save(avatarArticle); // 업데이트된 likeCount 저장
//                    return "좋아요 취소";
//                })
//                .orElseGet(() -> {
//                    AvatarLike avatarLike = AvatarLike.builder()
//                            .avatarArticle(avatarArticle)
//                            .member(member)
//                            .build();
//                    avatarLikeRepository.save(avatarLike);
//                    avatarArticle.increaseLikeCount(); // 좋아요 증가
//                    avatarArticleRepository.save(avatarArticle); // 업데이트된 likeCount 저장
//                    return "좋아요";
//                });
//    }
//
//
//    private String handleLikeVideo(Member member, VideoArticle videoArticle) {
//        return videoLikeRepository.findByVideoArticleAndMember(videoArticle, member)
//                .map(existingLike -> {
//                    videoLikeRepository.delete(existingLike);
//                    videoArticle.decreaseLikeCount(); // 좋아요 감소
//                    videoArticleRepository.save(videoArticle); // 업데이트된 likeCount 저장
//                    return "좋아요 취소";
//                })
//                .orElseGet(() -> {
//                	VideoLike videoLike = VideoLike.builder()
//                            .videoArticle(videoArticle)
//                            .member(member)
//                            .videoId(videoArticle.getVideo().getId())
//                            .build();
//                   videoLikeRepository.save(videoLike);
//                    videoArticle.increaseLikeCount(); // 좋아요 증가
//                    videoArticleRepository.save(videoArticle); // 업데이트된 likeCount 저장
//                    return "좋아요";
//                });
//    }
//
//
//    private Member getMember(Long memberId) {
//        return memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
//    }
//
//    private AvatarArticle getAvatarArticle(Long articleId) {
//        return avatarArticleRepository.findById(articleId)
//                .orElseThrow(() -> new ArticleNotFoundException("게시글을 찾을 수 없습니다."));
//    }
