package com.ziguonnana.ziguserver.domain.avatar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ziguonnana.ziguserver.domain.avatar.entity.Avatar;

public interface AvatarRepository extends JpaRepository<Avatar, Long> {
    List<Avatar> findAllByMemberId(Long memberId);
}
