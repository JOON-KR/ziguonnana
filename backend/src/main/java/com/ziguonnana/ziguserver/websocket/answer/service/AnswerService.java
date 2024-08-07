package com.ziguonnana.ziguserver.websocket.answer.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentMap;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ziguonnana.ziguserver.exception.ErrorCode;
import com.ziguonnana.ziguserver.exception.PlayerException;
import com.ziguonnana.ziguserver.websocket.answer.dto.SelfIntroductionQuestion;
import com.ziguonnana.ziguserver.websocket.answer.dto.SelfIntroductionRequest;
import com.ziguonnana.ziguserver.websocket.art.service.ArtService;
import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;
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
	private final SimpMessagingTemplate messagingTemplate;
	private final ArtService artService;
	@Transactional
	public void getSelfIntroductionAnswer(String roomId, SelfIntroductionRequest request) {
		Room room = roomRepository.getRoom(roomId);
		Player player = room.getPlayers().get(request.getNum());
		if (player == null)
			throw new PlayerException(ErrorCode.PLAYER_NOT_FOUND);
		player.createAnswer(request.getAnswer());
		// 해당 룸의 player 정보 업데이트
		room.getPlayers().put(player.getNum(), player);
		// 룸 정보 업데이트
		ConcurrentMap<String, Room> rooms = roomRepository.getAllRooms();
		rooms.put(roomId, room);
		room.countUp();
		if (room.getCount() == room.getPeople()) {
			room.countInit();
			room.cycleInit();
			nextGame(roomId);
		}
		log.info("player 정보 업데이트 player : " + player.toString());
		log.info("자기소개 답변 업데이트 room : " + rooms.toString());
	}
	
	public void getQuestion(String roomId) {
        List<String> questionList = new ArrayList<>();
        SelfIntroductionQuestion[] questions = SelfIntroductionQuestion.values();
        
        // 랜덤하게 5개의 질문 선택
        List<SelfIntroductionQuestion> shuffledQuestions = new ArrayList<>(List.of(questions));
        Collections.shuffle(shuffledQuestions);
        for (int i = 0; i < 5; i++) {
            questionList.add(shuffledQuestions.get(i).getQuestion());
        }

        GameMessage<List<String>> questionMessage = GameMessage.info("질문리스트 전파", questionList);
        messagingTemplate.convertAndSend("/topic/game/" + roomId, questionMessage);
    }
	
	private void nextGame(String roomId) {
		// 결과 전송
		boolean relayStart = true;
		GameMessage<Boolean> nextMessage = GameMessage.info("이어그리기 시작", relayStart);
		messagingTemplate.convertAndSend("/topic/game/" + roomId, nextMessage);
		artService.spreadKeyword(roomId);
	}
}
