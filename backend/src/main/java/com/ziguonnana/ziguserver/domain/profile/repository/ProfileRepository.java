package com.ziguonnana.ziguserver.domain.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ziguonnana.ziguserver.domain.profile.entity.Profile;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long>{
	Optional<List<Profile>> findByMemberId(Long memberId);
}
