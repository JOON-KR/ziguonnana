package com.ziguonnana.ziguserver.security.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.domain.member.Member;
import com.ziguonnana.ziguserver.domain.member.MemberRepository;
import com.ziguonnana.ziguserver.security.details.CustomUserDetails;
import com.ziguonnana.ziguserver.security.dto.CustomUserInfo;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

	private final MemberRepository memberRepository;

	@Override
	public UserDetails loadUserByUsername(final String email) throws UsernameNotFoundException {
		Optional<Member> member = memberRepository.findByEmail(email);
		if (member.isEmpty()) {
			throw new UsernameNotFoundException("User not found with email: " + email);
		}

		CustomUserInfo dto = CustomUserInfo.from(member.get());

		return new CustomUserDetails(dto);
	}
}
