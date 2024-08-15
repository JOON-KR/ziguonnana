package com.ziguonnana.ziguserver.websocket.repository;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Repository;

import com.ziguonnana.ziguserver.websocket.global.dto.Room;

@Repository
public class RoomRepository {
    private final ConcurrentMap<String, Room> rooms = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, String> membersRoom = new ConcurrentHashMap<>();

    public Room getRoom(String roomId) {
        return rooms.get(roomId);
    }

    public void addRoom(String roomId, Room room) {
        rooms.put(roomId, room);
    }

    public void removeRoom(String roomId) {
        rooms.remove(roomId);
    }

    public String getRoomIdByMemberId(String memberId) {
        return membersRoom.get(memberId);
    }

    public void addMemberToRoom(String memberId, String roomId) {
        membersRoom.put(memberId, roomId);
    }

    public void removeMemberFromRoom(String memberId) {
        membersRoom.remove(memberId);
    }

    public ConcurrentMap<String, Room> getAllRooms() {
        return rooms;
    }

    public ConcurrentMap<String, String> getAllMembersRoom() {
        return membersRoom;
    }
}
