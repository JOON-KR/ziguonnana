package com.ziguonnana.ziguserver.websocket.art.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.websocket.art.dto.AvatarCard;
import com.ziguonnana.ziguserver.websocket.art.dto.RelayArt;
import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;
import com.ziguonnana.ziguserver.websocket.global.dto.Player;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class ArtService {
	private final RoomRepository roomRepository;
	private final SimpMessagingTemplate messagingTemplate;

	// 그림 저장
	public void save(String roomId, RelayArt art) {
		Room room = roomRepository.getRoom(roomId);
		int cycle = room.getCycle();
		int people = room.getPeople();
		ConcurrentMap<Integer, List<RelayArt>> map = room.getArt();
		int num = (art.getNum() + cycle) % people;
		map.computeIfAbsent(num, k -> new ArrayList<>()).add(art);

		room.countUp();
		log.info("roomCount: {}", room.getCount());
		if (room.getCount() == people) {
			// 그림 전파 함수 호출
			Map<Integer, RelayArt> artMap = artResponse(roomId);
			messagingTemplate.convertAndSend("/topic/game/" + roomId, GameMessage.info("그림 전파", artMap));

			// 카운트 초기화 및 사이클 증가
			room.countInit();
			room.cycleUp();
			log.info("roomCycle: {}", room.getCycle());
			// 사이클이 people - 1에 도달하면 다음 단계로 전환
			if (room.getCycle() == people - 1) {
				log.info("이어그리기 종료=================다음단계로================");
				room.cycleInit();
				endRelay(roomId);
			}
		}
		log.info("그림 저장 :: roomId : {}, art : {} ", roomId, art.toString());
	}

	// 그림 및 키워드 전파
	public Map<Integer, RelayArt> artResponse(String roomId) {
		Room room = roomRepository.getRoom(roomId);
		int cycle = room.getCycle();
		int people = room.getPeople();
		ConcurrentMap<Integer, List<RelayArt>> map = room.getArt();
		Map<Integer, RelayArt> tmp = new HashMap<>();
		Random random = new Random();

		for (int i = 1; i <= people; i++) {
			List<RelayArt> artList = map.get((i + cycle) % people);

			if (artList != null && !artList.isEmpty()) {
				RelayArt originalArt = artList.get(artList.size() - 1);

				// 원본 객체 깊은 복사 및 키워드 설정
				RelayArt relayArt = RelayArt.builder().num(originalArt.getNum()).keyword(selectRandomKeyword(room))
						.art(originalArt.getArt()).build();

				tmp.put(i, relayArt);
			}
		}
		log.info("그림 전파 :: roomId : {}, art : {} ", roomId, tmp.toString());
		return tmp;
	}

	public String selectRandomKeyword(Room room) {
		List<String> combinedList = new ArrayList<>();
		ConcurrentMap<Integer, Player> players = room.getPlayers();

		for (Player player : players.values()) {
			List<String> feature = player.getProfile().getFeature();
			List<String> answer = player.getAnswer();
			for (String f : feature)
				combinedList.add(f);
			combinedList.addAll(answer);
		}

		if (!combinedList.isEmpty()) {
			Random random = new Random();
			return combinedList.get(random.nextInt(combinedList.size()));
		}

		return "차은우"; // 비어있을 경우
	}

	private void endRelay(String roomId) {
		Room room = roomRepository.getRoom(roomId);
		ConcurrentMap<Integer, List<RelayArt>> map = room.getArt();

		// 결과 전송
		String resultMessage = "이어그리기 종료";
		GameMessage<ConcurrentMap<Integer, List<RelayArt>>> artResult = GameMessage.info(resultMessage, map);
		messagingTemplate.convertAndSend("/topic/game/" + roomId, artResult);

		// 다음 단계로 전환 메시지 전송
		String nextStepMessage = "이어그리기 결과 확인";
		boolean endArt = true;
		Response<Boolean> endResponse = Response.ok(CommandType.ART_END, endArt);
		messagingTemplate.convertAndSend("/topic/game/" + roomId, endResponse);
		log.info("그림 그리기 결과 :: roomId : {}, art : {} ", roomId, artResult);
		spreadAvatarCard(roomId);
		//아바타 결과 반환
	}
	//아직 어디서 호출할지 회의해봐야함
	public void spreadAvatarCard(String roomId) {
	    Room room = roomRepository.getRoom(roomId);
	    ConcurrentMap<Integer, List<RelayArt>> map = room.getArt();
	    int people = room.getPeople();
	    ConcurrentMap<Integer, AvatarCard> cards = new ConcurrentHashMap<>();

	    for (int i = 1; i <= people; i++) {
	        List<RelayArt> tmp = map.get(i);

	        if (tmp != null && !tmp.isEmpty()) {
	            RelayArt art = tmp.get(tmp.size() - 1);
	            List<String> features = tmp.stream()
	                                       .limit(3)
	                                       .map(RelayArt::getKeyword)
	                                       .collect(Collectors.toList());

	            AvatarCard card = AvatarCard.builder()
	                                        .avatarImage(art.getArt()) // art.getArt()) 나중에 s3로 연결 해야하는데 로직을 고민해봐야함
	                                        .feature(features)
	                                        .build();
	            cards.put(i, card);
	        }
	    }
	    Response<ConcurrentMap<Integer, AvatarCard>> cardMessage = Response.ok(CommandType.AVATAR_CARD, cards);
		messagingTemplate.convertAndSend("/topic/game/" + roomId, cardMessage);
		log.info("아바타 명함 :: roomId : {}, avatarCard : {} ", roomId, cardMessage);
	}

	

	public void spreadKeyword(String roomId) {
		Room room = roomRepository.getRoom(roomId);
		List<RelayArt> keywordList = getKeyword(room);
		ConcurrentMap<Integer, RelayArt> map = new ConcurrentHashMap<>();
		for(int i=0; i<keywordList.size();i++) {
			map.put(i+1, keywordList.get(i));
		}
		GameMessage<ConcurrentMap<Integer, RelayArt>> keyword = GameMessage.info("이어그리기 첫 키워드 전파", map);
		messagingTemplate.convertAndSend("/topic/game/" + room.getRoomId(), keyword);
		log.info("이어그리기 키워드 발송");
	}

	public List<RelayArt> getKeyword(Room room) {
		int people = room.getPeople();
		ConcurrentMap<Integer, Player> players = room.getPlayers();
		List<RelayArt> relayArts = new ArrayList<>();
		Random random = new Random();

		for (int i = 1; i <= people; i++) {
			Player player = players.get(i);
			List<String> combinedList = new ArrayList<>();

			// feature와 answer 리스트를 결합
			List<String> feature = player.getProfile() != null ? player.getProfile().getFeature() : null;
			List<String> answer = player.getAnswer();

			if (feature != null) {
				combinedList.addAll(feature);
			}

			if (answer != null) {
				combinedList.addAll(answer);
			}

			// 랜덤하게 값을 선택
			if (!combinedList.isEmpty()) {
				String randomKeyword = combinedList.get(random.nextInt(combinedList.size()));
				RelayArt relayArt = RelayArt.builder().num((i + 1) % (people) == 0 ? i + 1 : (i + 1) % (people))
						.keyword(randomKeyword).build();
				relayArts.add(relayArt);
			}
		}

		return relayArts;
	}

}
