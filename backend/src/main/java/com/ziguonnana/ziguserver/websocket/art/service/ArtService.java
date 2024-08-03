package com.ziguonnana.ziguserver.websocket.art.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentMap;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.exception.RoomNotFoundException;
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
        Room room = getRoom(roomId);
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
    }

    // 그림 전파
    public Map<Integer, RelayArt> artResponse(String roomId) {
        Room room = getRoom(roomId);
        int cycle = room.getCycle();
        int people = room.getPeople();
        ConcurrentMap<Integer, List<RelayArt>> map = room.getArt();
        Map<Integer, RelayArt> tmp = new HashMap<>();
        for (int i = 1; i <= people; i++) {
            List<RelayArt> art = map.get((i + cycle) % people);
            tmp.put(i, art.get(art.size() - 1));
        }
        return tmp;
    }

    private void endRelay(String roomId) {
        Room room = getRoom(roomId);
        ConcurrentMap<Integer, List<RelayArt>> map = room.getArt();
        
        // 결과 전송
        String resultMessage = "이어그리기 종료";
        GameMessage<ConcurrentMap<Integer, List<RelayArt>>> artResult = GameMessage.info(resultMessage, map);
        messagingTemplate.convertAndSend("/topic/game/" + roomId, artResult);
        
        // 다음 단계로 전환 메시지 전송
        String nextStepMessage = "이어그리기 결과 확인";
        boolean endArt = true;
        messagingTemplate.convertAndSend("/topic/game/" + roomId, endArt);
    }

    public Room getRoom(String roomId) {
        return Optional.ofNullable(roomRepository.getRoom(roomId))
                .orElseThrow(() -> new RoomNotFoundException("방을 찾을 수 없습니다.: " + roomId));
    }

    public Player getPlayer(String roomId, String memberId) {
        return getRoom(roomId).getPlayers().get(memberId);
    }

    public List<Room> getAllRooms() {
        return new ArrayList<>(roomRepository.getAllRooms().values());
    }
}
