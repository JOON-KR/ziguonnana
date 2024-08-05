package com.ziguonnana.ziguserver.websocket.art.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentMap;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.websocket.art.dto.RelayArt;
import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;
import com.ziguonnana.ziguserver.websocket.global.dto.Player;
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
        if (room.getCount() == people) {
            // 그림 전파 함수 호출
            Map<Integer, RelayArt> artMap = artResponse(roomId);
            messagingTemplate.convertAndSend("/topic/game/" + roomId, artMap);

            // 카운트 초기화 및 사이클 증가
            room.countInit();
            room.cycleUp();

            // 사이클이 people - 1에 도달하면 다음 단계로 전환
            if (room.getCycle() == people - 1) {
                room.cycleInit();
                endRelay(roomId);
            }
        }
        log.info("그림 저장 :: roomId : {}, art : {} " , roomId, art.toString());
    }
    //그림 및 키워드 전파
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
                RelayArt relayArt = RelayArt.builder()
                        .num(originalArt.getNum())
                        .keyword(selectRandomKeyword(room))
                        .art(originalArt.getArt())
                        .build();

                tmp.put(i, relayArt);
            }
        }
        log.info("그림 전파 :: roomId : {}, art : {} " , roomId, tmp.toString());
        return tmp;
    }
    private String selectRandomKeyword(Room room) {
        List<String> combinedList = new ArrayList<>();
        ConcurrentMap<Integer, Player> players = room.getPlayers();

        for (Player player : players.values()) {
            String[] feature = player.getProfile().getFeature();
            List<String> answer = player.getAnswer();
            for (String f : feature) combinedList.add(f);
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
        GameMessage<Boolean>nextMessage = GameMessage.info(nextStepMessage, endArt);
        messagingTemplate.convertAndSend("/topic/game/" + roomId, nextMessage);
        log.info("그림 그리기 결과 :: roomId : {}, art : {} " , roomId, artResult);
    }


}
