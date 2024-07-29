package com.ziguonnana.ziguserver.domain.member;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ziguonnana.ziguserver.domain.member.entity.Member;


@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

	Optional<Member> findByEmail(String email);

	//List<Member> findByName(String name);
}
