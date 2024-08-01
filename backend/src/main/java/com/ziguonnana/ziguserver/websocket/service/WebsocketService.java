package com.ziguonnana.ziguserver.websocket.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.domain.profile.dto.ProfileRequest;
import com.ziguonnana.ziguserver.domain.profile.entity.Profile;
import com.ziguonnana.ziguserver.exception.RoomNotFoundException;
import com.ziguonnana.ziguserver.websocket.dto.Player;
import com.ziguonnana.ziguserver.websocket.dto.Room;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class WebsocketService {
    private final ConcurrentMap<String, Room> rooms = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, String> membersRoom = new ConcurrentHashMap<>();

    public String createRoom(ProfileRequest request, String roomId) {
        List<Player> list = new ArrayList<>();
        String memberId = UUID.randomUUID().toString();
        Profile profile = Profile.from(request);
        Player player = Player.builder()
                .memberId(memberId)
                .profile(profile)
                .role("admin")
                .roomId(roomId)
                .build();
        list.add(player);
        Room room = Room.builder()
                .players(list)
                .build();
        rooms.put(roomId, room);
        membersRoom.put(memberId, roomId);
        return memberId;
    }

    public Room getRoom(String roomId) {
        return Optional.ofNullable(rooms.get(roomId))
                .orElseThrow(() -> new RoomNotFoundException("방을 찾을 수 없습니다.: " + roomId));
    }

    public String join(String roomId, ProfileRequest request) {
        String memberId = UUID.randomUUID().toString();
        Profile profile = Profile.from(request);
        Player player = Player.builder()
                .memberId(memberId)
                .profile(profile)
                .role("user")
                .roomId(roomId)
                .build();
        addPlayerToRoom(roomId, player);
        membersRoom.put(memberId, roomId);
        return memberId;
    }

    public void addPlayerToRoom(String roomId, Player player) {
        Room room = Optional.ofNullable(rooms.get(roomId))
                .orElseThrow(() -> new RoomNotFoundException("방을 찾을 수 없습니다.: " + roomId));

        if (room.getPlayers().size() < 5) {
            room.getPlayers().add(player);
        } else {
            throw new RoomNotFoundException("방이 가득 찼습니다.: " + roomId);
        }
    }

    public void handleDisconnect(String memberId) {
        String roomId = Optional.ofNullable(membersRoom.remove(memberId))
                .orElseThrow(() -> new IllegalArgumentException("Member not found in any room: " + memberId));

        Room room = Optional.ofNullable(rooms.get(roomId))
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + roomId));

        room.getPlayers().removeIf(player -> player.getMemberId().equals(memberId));
        if (room.getPlayers().isEmpty()) {
            rooms.remove(roomId);
        }
    }

    public List<Room> getAllRooms() {
        return new ArrayList<>(rooms.values());
    }
}
