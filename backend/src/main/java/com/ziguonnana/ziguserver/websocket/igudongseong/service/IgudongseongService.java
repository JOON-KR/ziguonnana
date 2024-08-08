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
import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;
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
	
	public List<String> getKeyword(String roomId) {
		Room room = roomRepository.getRoom(roomId);
		int peopleCount = room.getPeople();
		//사람수만큼 랜덤 키워드 가져와서 반환
        Set<IgudongseongKeyword> uniqueKeywords = new HashSet<>();
        while (uniqueKeywords.size() < 6) {
            uniqueKeywords.add(IgudongseongKeyword.getRandomKeyword());
        }

		return uniqueKeywords.stream()
                .map(Enum::name)
                .collect(Collectors.toList());
	}
	//만들어진 키워드를 결과와 함께 매핑할 수 있도록 저장
	public void saveKeyword(List<String> keyword, String roomId) {
	    Room room = roomRepository.getRoom(roomId);
	    if (room == null) {
	        throw new RoomNotFoundException("방을 찾을 수 없습니다");
	    }
	    
	    int people = room.getPeople();
	    List<IgudongseongResult> igudongseong = room.getIgudongseong();
	    
	    if (igudongseong == null) {
	        igudongseong = new ArrayList<>();
	        room.setIgudongseong(igudongseong); // room에 igudongseong 리스트 설정
	    }

	    for (int i = 0; i < people; i++) {
	        if (i < keyword.size()) {
	            igudongseong.add(IgudongseongResult.builder()
	                .keyword(keyword.get(i))
	                .build());
	        } else {
	            igudongseong.add(IgudongseongResult.builder()
	                .keyword("호날두") // 기본 키워드 설정
	                .build());
	        }
	    }
	}

	
	public void getSimilar(String roomId,SimilarRequest request){
		Room room = roomRepository.getRoom(roomId);
		int people = room.getPeople();
		ConcurrentMap<Integer, List<Double>> vectors = room.getVectors();
		vectors.put(request.getNum(),request.getVector());
		room.countUp();
		
		if(room.getCount() == people) {
			room.countInit();
			List<List<Double>> list = new ArrayList<>();
			for(int i=1 ; i<=people; i++) {
				if(vectors.containsKey(i))
					list.add(vectors.get(i));
			}
			double[] similarityScores = calculateSimilarity(list);
			int mostSimilarUserCount = findMostSimilarUserCount(similarityScores);  // 가장 많은 유사도를 가진 사용자의 유사도 수
			String resultMessage = (mostSimilarUserCount == people) ? "성공!" : "실패!";
			GameMessage<Integer> result = GameMessage.info(resultMessage, mostSimilarUserCount);
			
			List<IgudongseongResult> Igudongseong = room.getIgudongseong();
			if(room.getCycle()<Igudongseong.size()) {
				Igudongseong.get(room.getCycle()).updateSuccess(mostSimilarUserCount);
			}
			room.cycleUp();
			messagingTemplate.convertAndSend("/topic/game/" + roomId, result);
			
			if(room.getCycle() == people ) {
				room.cycleInit();
				endGame(roomId);
			}
		}
	}
	
	public void endGame(String roomId){
		boolean end = true;
		GameMessage<Boolean> result = GameMessage.info("이구동성 게임 종료", end);
		messagingTemplate.convertAndSend("/topic/game/" + roomId, result);
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
