package com.ziguonnana.ziguserver.websocket.chat.service;

import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.exception.ErrorCode;
import com.ziguonnana.ziguserver.exception.PlayerException;
import com.ziguonnana.ziguserver.websocket.chat.dto.ChatRequest;
import com.ziguonnana.ziguserver.websocket.chat.dto.ChatResponse;
import com.ziguonnana.ziguserver.websocket.global.dto.Player;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {
    private final RoomRepository roomRepository;

    public ChatResponse spreadChat(String roomId, ChatRequest message) {
        Room room = roomRepository.getRoom(roomId);
        ConcurrentMap<Integer, Player> players = room.getPlayers();
        Player player = players.get(message.getNum());
        if (player == null) {
            throw new PlayerException(ErrorCode.PLAYER_NOT_FOUND);
        }
        String nickname = player.getNickname();

        return ChatResponse.builder()
                .content(message.getContent())
                .nickname(nickname)
                .build();
    }
}
