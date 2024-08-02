package com.ziguonnana.ziguserver.websocket.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import com.ziguonnana.ziguserver.exception.ErrorCode;
import com.ziguonnana.ziguserver.exception.PlayerException;
import com.ziguonnana.ziguserver.websocket.dto.*;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.exception.RoomNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
@Slf4j
public class WebsocketService {
    // key : roomId, value : Room
    private final ConcurrentMap<String, Room> rooms = new ConcurrentHashMap<>();
    // key : memberId, value : roomId
    private final ConcurrentMap<String, String> membersRoom = new ConcurrentHashMap<>();

    public SessionInfo createRoom( String roomId) {
        ConcurrentHashMap<String, Player> players = new ConcurrentHashMap<>();
        String memberId = UUID.randomUUID().toString();
        Player player = Player.builder()
                .memberId(memberId)
                .role("admin")
                .roomId(roomId)
                .build();
        players.put(memberId, player);
        Room room = Room.builder()
                .players(players)
                .build();
        rooms.put(roomId, room);
        membersRoom.put(memberId, roomId);
        SessionInfo info = SessionInfo.builder()
                .memberId(memberId)
                .roomId(roomId)
                .build();
        return info;
    }

    @Transactional
    public void createProfile(String roomId, GameProfileRequest request) {
        Room room = getRoom(roomId);
        Player player = getPlayer(roomId, request.getMemberId());
        GameProfile profile = GameProfile.from(request);
        player.createProfile(profile);
        // 해당 룸의 player 정보 업데이트
        room.getPlayers().put(request.getMemberId(), player);
        // 룸 정보 업데이트
        rooms.put(roomId, room);
    }
    
    public Room getRoom(String roomId) {
        return Optional.ofNullable(rooms.get(roomId))
                .orElseThrow(() -> new RoomNotFoundException("방을 찾을 수 없습니다.: " + roomId));
    }
    
    public Player getPlayer(String roomId, String memberId) {
        return getRoom(roomId).getPlayers().get(memberId);
    }
    
    public SessionInfo join(String roomId, GameProfile profile) {
        String memberId = UUID.randomUUID().toString();
        Player player = Player.builder()
                .memberId(memberId)
                .profile(profile)
                .role("user")
                .roomId(roomId)
                .build();
        addPlayerToRoom(roomId, player);
        membersRoom.put(memberId, roomId);
        SessionInfo info = SessionInfo.builder()
                .memberId(memberId)
                .roomId(roomId)
                .build();
        return info;
    }

    public void addPlayerToRoom(String roomId, Player player) {
        Room room = Optional.ofNullable(rooms.get(roomId))
                .orElseThrow(() -> new RoomNotFoundException("방을 찾을 수 없습니다.: " + roomId));

        if (room.getPlayers().size() < 5) {
            room.getPlayers().put(player.getMemberId(), player);
        } else {
            throw new RoomNotFoundException("방이 가득 찼습니다.: " + roomId);
        }
    }

    public void handleDisconnect(String memberId) {
        String roomId = Optional.ofNullable(membersRoom.remove(memberId))
                .orElseThrow(() -> new IllegalArgumentException("Member not found in any room: " + memberId));

        Room room = Optional.ofNullable(rooms.get(roomId))
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + roomId));

        room.getPlayers().remove(memberId);
        if (room.getPlayers().isEmpty()) {
            rooms.remove(roomId);
        }
    }

    public List<Room> getAllRooms() {
        return new ArrayList<>(rooms.values());
    }
    
    @Transactional
    public void getSelfIntroductionAnswer(String roomId, SelfIntroductionRequest request) {
        Player player = getPlayer(roomId, request.getMemberId());
        if(player == null) throw new PlayerException(ErrorCode.PLAYER_NOT_FOUND);
        player.createAnswer(request.getAnswer());
        Room room = getRoom(roomId);
        // 해당 룸의 player 정보 업데이트
        room.getPlayers().put(player.getMemberId(), player);
        // 룸 정보 업데이트
        rooms.put(roomId, room);
        log.info("player 정보 업데이트 player : " + player.toString());
        log.info("자기소개 답변 업데이트 room : " + rooms.toString());
    }
}
