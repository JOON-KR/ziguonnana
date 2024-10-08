package com.ziguonnana.ziguserver.redis;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
@RequestMapping("/redis")
@Slf4j
public class RedisController {
	private final RedisService redisService;
	
	@PostMapping
	public ResponseEntity<String> test (@RequestBody RedisDto redisDto){
		log.info("redis : {}",redisDto.toString());
		redisService.setValue(redisDto);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@GetMapping
	public ResponseEntity<String> get( RedisDto redisDto){
		String res = redisService.getValue(redisDto);
		return new ResponseEntity<>(res,HttpStatus.OK);
	}
	
	@PostMapping("r")
	public ResponseEntity<String> recentTest (@RequestBody RedisDto redisDto){
		log.info("redis : {}",redisDto.toString());
		redisService.addRecentSearch(redisDto);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	@GetMapping("r")
	public ResponseEntity<?> getRecent( RedisDto redisDto){
		List<Object>res = redisService.getRecentSearches(redisDto);
		return new ResponseEntity<>(res,HttpStatus.OK);
	}
}
