package com.ziguonnana.ziguserver.websocket.art.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.websocket.art.dto.ArtResponse;
import com.ziguonnana.ziguserver.websocket.art.dto.AvatarResult;
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
	private final String DEFAULT_IMAGE = "";

	// 키워드 리스트 맵 전파
	public void spreadKeyword(String roomId) {
		Room room = roomRepository.getRoom(roomId);
		createRandomKeyword(room);
		messagingTemplate.convertAndSend("/topic/game/" + room.getRoomId(), Response.ok(CommandType.ART_START, true));
	}

	public void createRandomKeyword(Room room) {
		ConcurrentMap<Integer, Player> players = room.getPlayers();
		int people = room.getPeople();

		for (int i = 1; i <= people; i++) {
			Player player = players.get(i);
			List<String> combinedList = new ArrayList<>();

			List<String> feature = player.getProfile().getFeature();
			List<String> answer = player.getAnswer();
			combinedList.addAll(feature);
			combinedList.addAll(answer);

			// 중복을 허용하지 않기 위해 Set을 사용
			Set<String> uniqueSelections = new HashSet<>();
			Random random = new Random();

			while (uniqueSelections.size() <= 6 && !combinedList.isEmpty()) {
				String randomSelection = combinedList.get(random.nextInt(combinedList.size()));
				uniqueSelections.add(randomSelection);
			}

			// Set을 List로 변환하여 플레이어의 번호를 키로 하고 맵에 추가
			player.createAnswer(new ArrayList<>(uniqueSelections));
		}
		log.info("----이어그리기 랜덤 키워드 생성  : {}",players);

	}

	// 그림 저장 후 응답전달
	public void save(String roomId, String art) {
		
		log.info("----이어그리기 그림 저장 요청: {}",art);
		Room room = roomRepository.getRoom(roomId);
		int cycle = room.getCycle();
		
		int people = room.getPeople();
		if(cycle>=people) {
			return;
		}
		ConcurrentMap<Integer, List<RelayArt>> map = room.getArt();
		int targetUser = cycle+1;
		int userNo = (targetUser+room.getCount()) % people == 0 ? people : (targetUser+room.getCount()) % people;
		//저장
		//첫번째 카운트 ( 다음사람이 첫번쨰로 그릴 수 있게 반환)
		if(room.getCount() == 0) {
			if(userNo == people) userNo = 1;
			else userNo++;
			String keyword = room.getPlayers().get(targetUser).getAnswer().get(0);
			ArtResponse response = ArtResponse.builder()
					.art(DEFAULT_IMAGE)
					.currentUser(userNo)
					.targetUser(targetUser)
					.keyword(keyword)
					.build();
			log.info("----{}번째 사이클 시작 -------",cycle+1);
			log.info("---- targetUser : {}, currentUser : {}, art: {}",response.getTargetUser(),response.getCurrentUser(),response.getArt());
			//저장안하고 다음 타겟 및 그릴사람 반환 
			messagingTemplate.convertAndSend("/topic/game/" + room.getRoomId(),Response.ok(CommandType.ART_RELAY, response));
			room.countUp();
			return;
		}
		log.info("----그림저장 --- targetUser : {}, currentUser : {}",targetUser,userNo);
		//현재 전달받은 그림 타겟에 저장
		List<RelayArt> artList = map.get(targetUser);
		RelayArt relayArt = RelayArt.builder()
				.art(art)
				.num(userNo)
				.keyword(room.getPlayers().get(targetUser).getAnswer().get(room.getCount()-1))
				.build();
		artList.add(relayArt);
		//세이브 카운트 업
		room.countUp();
		// 사이클이 끝나면 사이클업
		if(room.getCount() >= people) {
			log.info("----{}번 사이클 종료 ",cycle+1);
			room.cycleUp();
			room.countInit();
			//이어그리기 끝나면
			if(room.getCycle() == people) {
				endRelay(roomId);
			}
			//사이클만 끝나면
			save(roomId, DEFAULT_IMAGE);
			return;
		}
		ArtResponse response = ArtResponse.builder()
					.art(art)
					.currentUser(userNo+1 == people? people : (userNo+1)%people)
					.targetUser(targetUser)
					.keyword(room.getPlayers().get(targetUser).getAnswer().get(room.getCount()))
					.build();

		log.info("----다음 그림 반환 : targetUser : {}, currentUser : {}, art: {}",response.getTargetUser(),response.getCurrentUser(),response.getArt());
		messagingTemplate.convertAndSend("/topic/game/"+room.getRoomId(),Response.ok(CommandType.ART_RELAY,response));
	}

	

	private void endRelay(String roomId) {
		Room room = roomRepository.getRoom(roomId);
		ConcurrentMap<Integer, List<RelayArt>> map = room.getArt();
		// 결과 전송
		Response<ConcurrentMap<Integer, List<RelayArt>>> endResponse = Response.ok(CommandType.ART_END, map);
		messagingTemplate.convertAndSend("/topic/game/" + roomId, endResponse);
		log.info("그림 그리기 결과 :: roomId : {}, art : {} ", roomId, endResponse.getData());
		// 아바타 결과 반환
		spreadAvatarCard(roomId);
	}

	// 아직 어디서 호출할지 회의해봐야함
	public void spreadAvatarCard(String roomId) {
		Room room = roomRepository.getRoom(roomId);
		ConcurrentMap<Integer, List<RelayArt>> map = room.getArt();
		int people = room.getPeople();
		ConcurrentMap<Integer, AvatarResult> cards = new ConcurrentHashMap<>();

		for (int i = 1; i <= people; i++) {
			List<RelayArt> tmp = map.get(i);

			if (tmp != null && !tmp.isEmpty()) {
				RelayArt art = tmp.get(tmp.size() - 1);
				List<String>answer = room.getPlayers().get(i).getAnswer();
				List<String> features = new ArrayList<>();
				for(int j=0;j<3;j++) {
					features.add(answer.get(i));
				}
				AvatarResult card = AvatarResult.builder()
						.avatarImage(art.getArt()) 
						.feature(features)
						.build();
				cards.put(i, card);
			}
		}
		Response<ConcurrentMap<Integer, AvatarResult>> cardMessage = Response.ok(CommandType.AVATAR_CARD, cards);
		messagingTemplate.convertAndSend("/topic/game/" + roomId, cardMessage);
		log.info("아바타 명함 :: roomId : {}, avatarCard : {} ", roomId, cardMessage);
	}

	public void start(String roomId, String image) {
		Room room = roomRepository.getRoom(roomId);
		room.countUp();
		if(room.getCount()>=room.getPeople()&&!room.isRelay()) {
			room.relayEnd();
			room.countInit();
			room.cycleInit();
			save(roomId, DEFAULT_IMAGE);		
		}
	}

}
