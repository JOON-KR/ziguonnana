package com.ziguonnana.ziguserver.domain.article.avatar.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.domain.article.avatar.entity.AvatarArticle;
import com.ziguonnana.ziguserver.domain.article.avatar.repository.AvatarArticleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AvatarArticleService {
	private AvatarArticleRepository avatarArticleRepository;
	
//	public ArticleResponse createArticle(AvatarArticle article) {
//		
//	}
}
