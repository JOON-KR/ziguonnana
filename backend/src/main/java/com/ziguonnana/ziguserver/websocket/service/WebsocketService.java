package com.ziguonnana.ziguserver.websocket.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.exception.RoomNotFoundException;
import com.ziguonnana.ziguserver.websocket.dto.GameProfile;
import com.ziguonnana.ziguserver.websocket.dto.GameProfileRequest;
import com.ziguonnana.ziguserver.websocket.dto.Player;
import com.ziguonnana.ziguserver.websocket.dto.Room;
import com.ziguonnana.ziguserver.websocket.dto.SessionInfo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class WebsocketService {
    private final ConcurrentMap<String, Room> rooms = new ConcurrentHashMap<>();
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
    
    public void createProfile(String roomId, GameProfileRequest request) {
        Room room = getRoom(roomId);
        Player player = getPlayer(roomId, request.getMemberId());
        GameProfile profile = GameProfile.from(request);
        player.createProfile(profile);
    }
    
    public Room getRoom(String roomId) {
        return Optional.ofNullable(rooms.get(roomId))
                .orElseThrow(() -> new RoomNotFoundException("방을 찾을 수 없습니다.: " + roomId));
    }
    
    public Player getPlayer(String roomId, String memberId) {
        return rooms.get(roomId).getPlayers().get(memberId);
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
}
