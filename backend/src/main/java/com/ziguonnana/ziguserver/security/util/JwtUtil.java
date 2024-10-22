package com.ziguonnana.ziguserver.security.util;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.ziguonnana.ziguserver.security.dto.CustomUserInfo;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtUtil {
	private final Key key;
	private final long accessTokenExpTime;
	private final long refreshTokenExpTime;

	public JwtUtil(@Value("${jwt.secret}") String secretKey,
		@Value("${jwt.expiration_time}") long accessTokenExpTime,
		@Value("${jwt.refresh_expiration_time}") long refreshTokenExpTime) {
		byte[] keyBytes = Decoders.BASE64.decode(secretKey);
		this.key = Keys.hmacShaKeyFor(keyBytes);
		this.accessTokenExpTime = accessTokenExpTime;
		this.refreshTokenExpTime = refreshTokenExpTime;
	}

	public String createAccessToken(CustomUserInfo member) {
		return createToken(member, accessTokenExpTime);
	}

	public String createRefreshToken(CustomUserInfo member) {
		return createToken(member, refreshTokenExpTime);
	}

	private String createToken(CustomUserInfo member, long expireTime) {
		Claims claims = Jwts.claims().setSubject(member.email());
		claims.put("id", member.id());
		claims.put("name", member.name());
		claims.put("role", member.role());
		Date now = new Date();
		Date validity = new Date(now.getTime() + expireTime * 1000);

		return Jwts.builder()
			.setClaims(claims)
			.setIssuedAt(now)
			.setExpiration(validity)
			.signWith(key, SignatureAlgorithm.HS256)
			.compact();
	}

	public boolean isValidToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			log.error("Invalid token: {}", e.getMessage());
			return false;
		}
	}

	public String getUsernameFromToken(String token) {
		Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
		return claims.getSubject();
	}

	public long getRemainingTime(String token) {
		Date expiration = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getExpiration();
		return expiration.getTime() - new Date().getTime();
	}
}
