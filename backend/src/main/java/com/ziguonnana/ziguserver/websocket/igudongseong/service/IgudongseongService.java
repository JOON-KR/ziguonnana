package com.ziguonnana.ziguserver.websocket.igudongseong.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.igudongseong.dto.IgudongseongKeyword;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class IgudongseongService {
	
	private final RoomRepository roomRepository;
	
	public List<String> getKeyword(String roomId) {
		Room room = roomRepository.getRoom(roomId);
		int peopleCount = room.getPeople();
		//사람수만큼 랜덤 키워드 가져와서 반환
        Set<IgudongseongKeyword> uniqueKeywords = new HashSet<>();
        while (uniqueKeywords.size() < peopleCount) {
            uniqueKeywords.add(IgudongseongKeyword.getRandomKeyword());
        }

		return uniqueKeywords.stream()
                .map(Enum::name)
                .collect(Collectors.toList());
	}
	
	public GameMessage<String> getSimilar(String roomId, List<List<Double>> userVectors){
		Room room = roomRepository.getRoom(roomId);
		int people = room.getPeople();
		
		room.countUp();
		
		double[] similarityScores = calculateSimilarity(userVectors);
		int mostSimilarUserCount = findMostSimilarUserCount(similarityScores);  // 가장 많은 유사도를 가진 사용자의 유사도 수

		String resultMessage = (mostSimilarUserCount == people) ? "성공!" : "실패!";
		GameMessage<Integer> result = GameMessage.info(resultMessage, mostSimilarUserCount);

		if(room.getCount() == people) {
			room.cycleUp();
			room.countInit();
			
			if(room.getCycle() == people) {
				room.cycleInit();
				endGame(roomId);
			}
		}
		
		return result;
	}
	
	public GameMessage<Boolean> endGame(String roomId){
		// 게임 종료 로직을 여기에 추가
		return null;
	}

	private double[] calculateSimilarity(List<List<Double>> userVectors) {
        int numUsers = userVectors.size();
        double[] similarityScores = new double[numUsers];

        for (int i = 0; i < numUsers; i++) {
            int similarCount = 0;
            List<Double> currentUser = userVectors.get(i);

            for (int j = 0; j < numUsers; j++) {
                if (i != j) {
                    List<Double> otherUser = userVectors.get(j);
                    double similarity = cosineSimilarity(currentUser, otherUser);
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

    private double cosineSimilarity(List<Double> vector1, List<Double> vector2) {
        if (vector1.size() != vector2.size()) {
            throw new IllegalArgumentException("벡터 길이가 다릅니다.");
        }
        double dotProduct = 0.0;
        double magnitude1 = 0.0;
        double magnitude2 = 0.0;

        for (int i = 0; i < vector1.size(); i++) {
            dotProduct += vector1.get(i) * vector2.get(i);
            magnitude1 += vector1.get(i) * vector1.get(i);
            magnitude2 += vector2.get(i) * vector2.get(i);
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
