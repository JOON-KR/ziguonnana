package com.ziguonnana.ziguserver.websocket.service;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.domain.profile.dto.ProfileRequest;
import com.ziguonnana.ziguserver.exception.RoomNotFoundException;
import com.ziguonnana.ziguserver.websocket.dto.GameProfile;
import com.ziguonnana.ziguserver.websocket.dto.Player;
import com.ziguonnana.ziguserver.websocket.dto.Room;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@RequiredArgsConstructor
@Service
@Slf4j
public class WebsocketService {
private final ConcurrentMap<String, Room> rooms = new ConcurrentHashMap<>();
    
    public String createRoom(GameProfile request,String roomId) {
        List<Player> list = new ArrayList<>();
        String memberId = UUID.randomUUID().toString();
        Player player = Player.builder()
        		.memberId(memberId)
        		.profile(request)
        		.role("admin")
        		.roomId(roomId)
        		.build();
        list.add(player);
        Room room = Room.builder()
        		.players(list)
        		.build();
        rooms.put(roomId, room);
        log.info("rooms: {}, roomId: {}, memberId: {},player: ",getAllRooms().toString(),roomId,memberId,player);
        log.info("roomSize: {}",room.getPlayers().size());
        return memberId;
    }	
    
    public Room getRoom(String roomId) {
        return Optional.ofNullable(rooms.get(roomId))
                       .orElseThrow(() -> new RoomNotFoundException("방을 찾을 수 없습니다.: " + roomId));
    }
    public String join(String roomId,GameProfile request) {
    	String memberId = UUID.randomUUID().toString();
    	Player player = Player.builder()
    			.memberId(memberId)
    			.profile(request)
    			.role("user")
    			.roomId(roomId)
    			.build();
    	addPlayerToRoom(roomId, player);
    	log.info("rooms: {}, roomId: {}, memberId: {},player: ",getAllRooms().toString(),roomId,memberId,player);
    	log.info("roomSize: {}",getRoom(roomId).getPlayers().size());
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
    
    public List<Room> getAllRooms() {
        return new ArrayList<>(rooms.values());
    }
}
