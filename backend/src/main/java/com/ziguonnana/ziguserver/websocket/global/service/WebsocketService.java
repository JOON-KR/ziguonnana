package com.ziguonnana.ziguserver.websocket.global.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.exception.RoomNotFoundException;
import com.ziguonnana.ziguserver.websocket.art.dto.RelayArt;
import com.ziguonnana.ziguserver.websocket.global.dto.ChatMessage;
import com.ziguonnana.ziguserver.websocket.global.dto.CreateRequest;
import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;
import com.ziguonnana.ziguserver.websocket.global.dto.GameProfile;
import com.ziguonnana.ziguserver.websocket.global.dto.GameProfileRequest;
import com.ziguonnana.ziguserver.websocket.global.dto.Player;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.global.dto.SessionInfo;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class WebsocketService {
    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public SessionInfo createRoom(String roomId, CreateRequest request) {
        ConcurrentHashMap<String, Player> players = new ConcurrentHashMap<>();
        String memberId = UUID.randomUUID().toString();
        Player player = Player.builder()
                .memberId(memberId)
                .role("admi.")
                .roomId(roomId)
                .num(1)
                .build();
        players.put(memberId, player);
        Room room = Room.builder()
                .players(players)
                .people(request.getPeople())
                .status(0)
                .pose(0)
                .teamName(request.getTeamName())
                .art(new ConcurrentHashMap<>())
                .cycle(0)
                .count(0)
                .build();
        roomRepository.addRoom(roomId, room);
        roomRepository.addMemberToRoom(memberId, roomId);
        SessionInfo info = SessionInfo.builder()
                .memberId(memberId)
                .roomId(roomId)
                .num(player.getNum())
                .build();
        return info;
    }

    public void createProfile(String roomId, GameProfileRequest request) {
        Room room = getRoom(roomId);
        Player player = getPlayer(roomId, request.getMemberId());
        GameProfile profile = GameProfile.from(request);
        player.createProfile(profile);
        
        // 프로필 생성 시 count를 증가시킵니다.
        room.countUp();

        // count가 people과 같아지면 게임 시작
        if (room.getCount() == room.getPeople()) {
            startGame(room);
        }
    }

    public Room getRoom(String roomId) {
        return Optional.ofNullable(roomRepository.getRoom(roomId))
                .orElseThrow(() -> new RoomNotFoundException("방을 찾을 수 없습니다.: " + roomId));
    }

    public Player getPlayer(String roomId, String memberId) {
        return getRoom(roomId).getPlayers().get(memberId);
    }

    public void join(String roomId, GameProfile profile) {
        String memberId = UUID.randomUUID().toString();
        Room room = getRoom(roomId);

        Player player = Player.builder()
                .memberId(memberId)
                .profile(profile)
                .role("user")
                .roomId(roomId)
                .num(room.getPlayers().size() + 1)
                .build();
        addPlayerToRoom(roomId, player);
        roomRepository.addMemberToRoom(memberId, roomId);
    }

    private void startGame(Room room) {
        room.initArt();
        // 게임 시작 알림을 클라이언트에 보냅니다.
        
        boolean start = true;
        GameMessage<Boolean> startMessage = GameMessage.info("게임 시작!", start);
        messagingTemplate.convertAndSend("/topic/game/" + room.getRoomId(), startMessage);
    }

    public void addPlayerToRoom(String roomId, Player player) {
        Room room = getRoom(roomId);

        if (room.getPlayers().size() < room.getPeople()) {
            room.getPlayers().put(player.getMemberId(), player);
        } else {
            throw new RoomNotFoundException("방이 가득 찼습니다.: " + roomId);
        }
    }
    
    public void handleDisconnect(String memberId) {
        String roomId = Optional.ofNullable(roomRepository.getRoomIdByMemberId(memberId))
                .orElseThrow(() -> new IllegalArgumentException("Member not found in any room: " + memberId));

        Room room = Optional.ofNullable(roomRepository.getRoom(roomId))
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + roomId));

        room.getPlayers().remove(memberId);
        if (room.getPlayers().isEmpty()) {
            roomRepository.removeRoom(roomId);
        }
    }

    public List<Room> getAllRooms() {
        return new ArrayList<>(roomRepository.getAllRooms().values());
    }
}
