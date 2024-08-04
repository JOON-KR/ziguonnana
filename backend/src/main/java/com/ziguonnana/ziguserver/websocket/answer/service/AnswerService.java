package com.ziguonnana.ziguserver.websocket.answer.service;






import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.exception.ErrorCode;
import com.ziguonnana.ziguserver.exception.PlayerException;
import com.ziguonnana.ziguserver.websocket.answer.dto.SelfIntroductionRequest;
import com.ziguonnana.ziguserver.websocket.global.dto.Player;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@RequiredArgsConstructor
@Service
@Slf4j
public class AnswerService {
	
	 private final RoomRepository roomRepository;
	 
	 @Transactional
	    public void getSelfIntroductionAnswer(String roomId, SelfIntroductionRequest request) {
	       Room room = roomRepository.getRoom(roomId);   
	       Player player = room.getPlayers().get(request.getMemberId());
	        if(player == null) throw new PlayerException(ErrorCode.PLAYER_NOT_FOUND);
	        player.createAnswer(request.getAnswer());
	        // 해당 룸의 player 정보 업데이트
	        room.getPlayers().put(player.getMemberId(), player);
	        // 룸 정보 업데이트
	        ConcurrentMap<String, Room> rooms= roomRepository.getAllRooms();
	        rooms.put(roomId, room);
	        log.info("player 정보 업데이트 player : " + player.toString());
	        log.info("자기소개 답변 업데이트 room : " + rooms.toString());
	    }

}
