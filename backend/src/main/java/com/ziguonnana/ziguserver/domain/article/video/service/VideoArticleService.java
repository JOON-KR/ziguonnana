package com.ziguonnana.ziguserver.domain.article.video.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.domain.article.video.dto.VideoArticleRequest;
import com.ziguonnana.ziguserver.domain.article.video.dto.VideoArticleResponse;
import com.ziguonnana.ziguserver.domain.article.video.entity.Video;
import com.ziguonnana.ziguserver.domain.article.video.entity.VideoArticle;
import com.ziguonnana.ziguserver.domain.article.video.repository.VideoArticleRepository;
import com.ziguonnana.ziguserver.domain.article.video.repository.VideoRepository;
import com.ziguonnana.ziguserver.domain.member.entity.Member;
import com.ziguonnana.ziguserver.domain.member.repository.MemberRepository;
import com.ziguonnana.ziguserver.exception.ArticleNotFoundException;
import com.ziguonnana.ziguserver.exception.VideoNotFoundException;
import com.ziguonnana.ziguserver.global.TokenInfo;
import com.ziguonnana.ziguserver.security.exception.MemberNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class VideoArticleService {
    private final VideoArticleRepository videoArticleRepository;
    private final MemberRepository memberRepository;
    private final VideoRepository videoRepository;

    public VideoArticleResponse createArticle(VideoArticleRequest articleRequest) {
        Long memberId = TokenInfo.getMemberId();
        Member member = getMember(memberId);
        Video video = getVideo(articleRequest.getVideoId());

        VideoArticle videoArticle = VideoArticle.builder()
                .member(member)
                .video(video)
                .title(articleRequest.getTitle())
                .likeCount(0)
                .viewCount(0)
                .isDelete(false)
                .build();

        videoArticleRepository.save(videoArticle);
        return VideoArticleResponse.from(videoArticle);
    }

    public VideoArticleResponse updateArticle(Long articleId, VideoArticleRequest articleRequest) {
        Long memberId = TokenInfo.getMemberId();
        VideoArticle videoArticle = findArticleById(articleId);

        if (!videoArticle.getMember().getId().equals(memberId)) {
            throw new ArticleNotFoundException("작성자가 일치하지 않습니다.");
        }

        Video video = getVideo(articleRequest.getVideoId());

        videoArticle.update(articleRequest,video);

        videoArticleRepository.save(videoArticle);
        return VideoArticleResponse.from(videoArticle);
    }

    public void deleteArticle(Long articleId) {
        Long memberId = TokenInfo.getMemberId();
        VideoArticle videoArticle = findArticleById(articleId);

        if (!videoArticle.getMember().getId().equals(memberId)) {
            throw new ArticleNotFoundException("작성자가 일치하지 않습니다.");
        }

        videoArticle.delete();
        videoArticleRepository.save(videoArticle);
    }

    public List<VideoArticleResponse> getAllArticles() {
        List<VideoArticle> articles = videoArticleRepository.findAll();
        return articles.stream()
                .map(VideoArticleResponse::from)
                .collect(Collectors.toList());
    }

    public VideoArticleResponse getArticleById(Long articleId) {
        VideoArticle videoArticle = findArticleById(articleId);
        videoArticle.increaseViewCount();
        videoArticleRepository.save(videoArticle);
        return VideoArticleResponse.from(videoArticle);
    }

    private VideoArticle findArticleById(Long articleId) {
        return videoArticleRepository.findById(articleId)
                .orElseThrow(() -> new ArticleNotFoundException("비디오 아티클을 찾을 수 없습니다."));
    }

    private Member getMember(Long memberId) {
        return memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
    }

    private Video getVideo(Long videoId) {
        return videoRepository.findById(videoId).orElseThrow(VideoNotFoundException::new);
    }
}
