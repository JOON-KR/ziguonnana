package com.ziguonnana.ziguserver.websocket.igudongseong.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.exception.RoomNotFoundException;
import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;
import com.ziguonnana.ziguserver.websocket.global.dto.KeyPoint;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.igudongseong.dto.IgudongseongKeyword;
import com.ziguonnana.ziguserver.websocket.igudongseong.dto.IgudongseongResult;
import com.ziguonnana.ziguserver.websocket.igudongseong.dto.SimilarRequest;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class IgudongseongService {

	private final RoomRepository roomRepository;
	private final SimpMessagingTemplate messagingTemplate;

	public void getKeyword(String roomId) {
		Room room = roomRepository.getRoom(roomId);
		room.statusUp();
		if (room.getStatus() > 1)
			return;
		Set<IgudongseongKeyword> uniqueKeywords = new HashSet<>();
		while (uniqueKeywords.size() < 6) {
			uniqueKeywords.add(IgudongseongKeyword.getRandomKeyword());
		}
		List<String> keyword = uniqueKeywords.stream().map(Enum::name).collect(Collectors.toList());
		saveKeyword(keyword, roomId);
		 log.info("=======이구동성 시작=======");
		 room.countInit();
		 room.cycleInit();
		messagingTemplate.convertAndSend("/topic/game/" + roomId, Response.ok(CommandType.IGUDONGSEONG_START, keyword));
		return;
	}

	public void saveKeyword(List<String> keyword, String roomId) {
		Room room = roomRepository.getRoom(roomId);
		if (room == null) {
			throw new RoomNotFoundException("방을 찾을 수 없습니다");
		}

		int people = room.getPeople();
		List<IgudongseongResult> igudongseong = room.getIgudongseong();

		if (igudongseong == null) {
			igudongseong = new ArrayList<>();
			room.setIgudongseong(igudongseong);
		}

		for (int i = 0; i < people; i++) {
			if (i < keyword.size()) {
				igudongseong.add(IgudongseongResult.builder().keyword(keyword.get(i)).build());
			} else {
				igudongseong.add(IgudongseongResult.builder().keyword("호날두").build());
			}
		}
	}

	public void getSimilar(String roomId, SimilarRequest request) {
		Room room = roomRepository.getRoom(roomId);
		log.info("----------이구동성 포인트: {}--------------", request);
		int people = room.getPeople();
		ConcurrentMap<Integer, List<KeyPoint>> vectors = room.getVectors();
		vectors.put(request.getNum(), request.getKeypoints());
		room.countUp();
		if (room.getCount() >= people) {
			room.countInit();
			List<List<KeyPoint>> list = new ArrayList<>();
			for (int i = 1; i <= people; i++) {
				if (vectors.containsKey(i))
					list.add(vectors.get(i));
			}
			double[] similarityScores = calculateSimilarity(list);
			int mostSimilarUserCount = findMostSimilarUserCount(similarityScores);
			String resultMessage = (mostSimilarUserCount == people - 1) ? "성공" : "실패";
			Response<String> response = Response.ok(CommandType.IGUDONGSEONG_CYCLE, resultMessage);
			log.info("----------이구동성 결과전송: {}--------------", mostSimilarUserCount);

			List<IgudongseongResult> Igudongseong = room.getIgudongseong();
			if (room.getCycle() < Igudongseong.size()) {
				Igudongseong.get(room.getCycle()).updateSuccess(mostSimilarUserCount);
			}
			room.cycleUp();
			messagingTemplate.convertAndSend("/topic/game/" + roomId, response);

			if (room.getCycle() > 6) {
				room.cycleInit();
				room.countInit();
				endGame(roomId);
			}
		}
	}

	public void endGame(String roomId) {
		log.info("----------------------이구동성 종료 -----------------------");
		Room room = roomRepository.getRoom(roomId);
		room.countInit();
		room.cycleInit();
		messagingTemplate.convertAndSend("/topic/game/" + roomId, Response.ok(CommandType.IGUDONGSEONG_END, true));
	}

	private double[] calculateSimilarity(List<List<KeyPoint>> userVectors) {
		int numUsers = userVectors.size();
		double[] similarityScores = new double[numUsers];

		for (int i = 0; i < numUsers; i++) {
			int similarCount = 0;
			List<KeyPoint> currentUser = userVectors.get(i);

			for (int j = 0; j < numUsers; j++) {
				if (i != j) {
					List<KeyPoint> otherUser = userVectors.get(j);
					double similarity = cosineSimilarity(currentUser, otherUser);
					log.info("------{} 와 {} 의 유사도 : {}------------", i + 1, j + 1, similarity);
					if (similarity >= 0.7) {
						similarCount++;
					}
				}
			}

			similarityScores[i] = similarCount;
		}

		return similarityScores;
	}

	private int findMostSimilarUserCount(double[] similarityScores) {
		int mostSimilarUserCount = 0;

		for (double score : similarityScores) {
			if (score > mostSimilarUserCount) {
				mostSimilarUserCount = (int) score;
			}
		}

		return mostSimilarUserCount;
	}

	private double cosineSimilarity(List<KeyPoint> vector1, List<KeyPoint> vector2) {
		double dotProduct = 0.0;
		double magnitude1 = 0.0;
		double magnitude2 = 0.0;

		for (int i = 0; i < vector1.size(); i++) {
			KeyPoint point1 = vector1.get(i);
			KeyPoint point2 = vector2.get(i);

			if (point1.getScore() >= 0.7 && point2.getScore() >= 0.7) {
				double x1 = point1.getPosition().getX();
				double y1 = point1.getPosition().getY();
				double x2 = point2.getPosition().getX();
				double y2 = point2.getPosition().getY();

				dotProduct += x1 * x2 + y1 * y2;
				magnitude1 += x1 * x1 + y1 * y1;
				magnitude2 += x2 * x2 + y2 * y2;
			}
		}

		magnitude1 = Math.sqrt(magnitude1);
		magnitude2 = Math.sqrt(magnitude2);

		if (magnitude1 == 0 || magnitude2 == 0) {
			return 0.0;
		} else {
			return dotProduct / (magnitude1 * magnitude2);
		}
	}

}
