package com.ziguonnana.ziguserver.websocket.result.service;

import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;
import com.ziguonnana.ziguserver.websocket.result.dto.GameResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class GameResultService {

    private final RoomRepository roomRepository;

    public GameResult getGameResult(String roomId) {
        Room room = roomRepository.getRoom(roomId);
        return room.makeGameResult();
    }
}
