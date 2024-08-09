package com.ziguonnana.ziguserver.websocket.pose.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.util.S3Util;
import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.KeyPoint;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.pose.dto.PoseRequest;
import com.ziguonnana.ziguserver.websocket.pose.dto.PoseResult;
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
	    // score가 0.7 이상인 Position만 필터링
	    List<List<Integer>> filteredPositions = poseRequest.getKeypoints().stream()
	        .filter(keyPoint -> keyPoint.getScore() >= 0.7)
	        .map(keyPoint -> List.of((int) keyPoint.getPosition().getX(), (int) keyPoint.getPosition().getY()))
	        .collect(Collectors.toList());

	    // PoseResult로 변환
	    PoseResult poseResult = PoseResult.builder()
	    		.num(poseRequest.getNum())
	    		.vector(filteredPositions)
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

		boolean isSuccess = inputPoints.stream().noneMatch(savedPoints::contains);
		List<ConcurrentHashMap<Integer, String>> poselist = room.getPoseResult();
		if(poselist.size()<=room.getCycle()) {
			poselist.add(new ConcurrentHashMap<>());
		}
		ConcurrentHashMap<Integer, String> currentCycle = poselist.get(room.getCycle());
		//결과 저장
		currentCycle.put(request.getNum(), isSuccess ? "성공" : "실패");
		log.info("포즈 계산 결과 전송: userNo={}, result={}", request.getNum(), isSuccess ? "성공" : "실패");
		//한 사이클에 모두가 저장이 되었다면
		if(currentCycle.size() == room.getPeople()) {
			log.info("포즈 계산 {}번째 사이클 완료", room.getCycle());
			room.cycleUp();
			// 결과 전송
			messagingTemplate.convertAndSend("/topic/game/" + roomId, Response.ok(CommandType.POSE_RESULT, currentCycle));
		}
		
		//6번 하고나면
		if(room.getCycle() >= 6){
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
				int x = Integer.parseInt(coords[0].trim());
				int y = Integer.parseInt(coords[1].trim());
				points.add(List.of(x, y));
			}

			reader.close();
		} catch (Exception e) {
			log.error("Error reading S3 file: " + fileName, e);
		}

		return points;
	}
}
