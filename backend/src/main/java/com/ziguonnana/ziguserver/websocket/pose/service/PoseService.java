package com.ziguonnana.ziguserver.websocket.pose.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.util.S3Util;
import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.pose.dto.PoseRequest;
import com.ziguonnana.ziguserver.websocket.pose.dto.PoseResult;
import com.ziguonnana.ziguserver.websocket.pose.dto.PoseSelect;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PoseService {

	private final RoomRepository roomRepository;
	private final SimpMessagingTemplate messagingTemplate;
	private final S3Util s3Util;

	public void processKeyPoints(String roomId, int poseType, PoseRequest poseRequest) {
	    // Set을 사용하여 중복을 제거
	    Set<List<Integer>> expandedPositions = new HashSet<>();

	    // score가 0.7 이상인 Position만 필터링하고, 각 포인트에 대해 확장된 포인트들을 추가
	    poseRequest.getKeypoints().stream()
	        .filter(keyPoint -> keyPoint.getScore() >= 0.7)
	        .forEach(keyPoint -> {
	            int x = (int) keyPoint.getPosition().getX();
	            int y = (int) keyPoint.getPosition().getY();
	            
	            // 각 포인트에 대해 반지름 5인 원 안의 모든 포인트를 추가
	            for (int dx = -30; dx <= 30; dx++) {
	                for (int dy = -30; dy <= 30; dy++) {
	                    if (dx * dx + dy * dy <= 900) { // 원 안에 있는지 확인 (반지름이 5이므로 5^2 = 25)
	                        expandedPositions.add(List.of(x + dx, y + dy));
	                    }
	                }
	            }
	        });
	    
	    
	    
	    // Set을 List로 변환
	    List<List<Integer>> expandedList = new ArrayList<>(expandedPositions);
	    // PoseResult로 변환
	    PoseResult poseResult = PoseResult.builder()
	            .num(poseRequest.getNum())
	            .vector(expandedList)
	            .build();

	    // PoseService의 calculate 함수 호출
	    calculate(roomId, poseType, poseResult);
	}

	public void calculate(String roomId, int poseType, PoseResult request) {
	    String fileName = "pose/poseType" + poseType + ".txt";
	    Room room = roomRepository.getRoom(roomId);
	    
	    // S3에서 파일을 읽어옵니다.
	    Set<List<Integer>> savedPoints = readPointsFromS3(fileName);

	    // request로 들어온 vector를 set으로 변환하여 비교합니다.
	    Set<List<Integer>> inputPoints = new HashSet<>(request.getVector());

	    // 일치하는 포인트를 세어 성공률을 계산합니다.
	    long matchingPoints = inputPoints.stream().filter(savedPoints::contains).count();
	    double totalPoints = inputPoints.size();
	    double successRate = (totalPoints - matchingPoints) / totalPoints * 100;

	    log.info("포즈 계산 결과: 총 포인트 수 = {}, 일치하는 포인트 수 = {}, 성공률 = {}%", 
	             totalPoints, matchingPoints, successRate);

	    // 성공률이 97% 이상일 경우에만 성공으로 판단
	    boolean isSuccess = successRate >= 80.0;

	    List<ConcurrentHashMap<Integer, String>> poselist = room.getPoseResult();
	    if (poselist.size() <= room.getCycle()) {
	        poselist.add(new ConcurrentHashMap<>());
	    }
	    ConcurrentHashMap<Integer, String> currentCycle = poselist.get(room.getCycle());

	    // 결과 저장
	    currentCycle.put(request.getNum(), isSuccess ? "성공" : "실패");
	    log.info("포즈 계산 결과 전송: userNo={}, result={}", request.getNum(), isSuccess ? "성공" : "실패");

	    // 한 사이클에 모두가 저장이 되었다면
	    if (currentCycle.size() == room.getPeople()) {
	        log.info("포즈 계산 {}번째 사이클 완료", room.getCycle());
	        room.cycleUp();
	        // 결과 전송
	        messagingTemplate.convertAndSend("/topic/game/" + roomId,
	                Response.ok(CommandType.POSE_RESULT, currentCycle));
	    }

	    // 6번 하고나면
	    if (room.getCycle() >= 6) {
	        log.info("포즈 종료", room.getCycle());
	        messagingTemplate.convertAndSend("/topic/game/" + roomId, Response.ok(CommandType.POSE_END, currentCycle));
	        room.cycleInit();
	    }

	    log.info("포즈 계산 전체결과 전송: roomId={}, result={}", roomId, currentCycle);
	}


	private Set<List<Integer>> readPointsFromS3(String fileName) {
		Set<List<Integer>> points = new HashSet<>();
		try {
			InputStream inputStream = s3Util.downloadFile(fileName);
			BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));

			String line;
			while ((line = reader.readLine()) != null) {
				String[] coords = line.replace("(", "").replace(")", "").split(",");
				int x = (int) Double.parseDouble(coords[0].trim());
				int y = (int) Double.parseDouble(coords[1].trim());
				points.add(List.of(x, y));
			}

			reader.close();
		} catch (Exception e) {
			log.error("Error reading S3 file: " + fileName, e);
		}

		return points;
	}

	public void select(String roomId, PoseSelect pose) {
		if (pose.getNum() != 1)
			return;
		messagingTemplate.convertAndSend("/topic/game/" + roomId,
				Response.ok(CommandType.POSE_TYPE, pose.getPoseType()));
	}
}
