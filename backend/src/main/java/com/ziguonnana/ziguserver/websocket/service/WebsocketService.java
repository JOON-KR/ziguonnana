package com.ziguonnana.ziguserver.websocket.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import com.ziguonnana.ziguserver.exception.ErrorCode;
import com.ziguonnana.ziguserver.exception.PlayerException;
import com.ziguonnana.ziguserver.websocket.dto.*;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.exception.RoomNotFoundException;
import com.ziguonnana.ziguserver.websocket.dto.GameProfile;
import com.ziguonnana.ziguserver.websocket.dto.GameProfileRequest;
import com.ziguonnana.ziguserver.websocket.dto.Player;
import com.ziguonnana.ziguserver.websocket.dto.RelayArt;
import com.ziguonnana.ziguserver.websocket.dto.Room;
import com.ziguonnana.ziguserver.websocket.dto.SessionInfo;

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
                .num(1)
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
                .num(player.getNum())
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
        Room room = rooms.get(memberId);
        
        Player player = Player.builder()
                .memberId(memberId)
                .profile(profile)
                .role("user")
                .roomId(roomId)
                .num(room.getPlayers().size()+1)
                .build();
        addPlayerToRoom(roomId, player);
        membersRoom.put(memberId, roomId);
        SessionInfo info = SessionInfo.builder()
                .memberId(memberId)
                .roomId(roomId)
                .num(player.getNum())
                .build();
        if(room.getPlayers().size() == room.getPeople()) {
        	info.full();
        	room.initArt();
        }
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
    
    // 그린 그림 저장
    //로컬에 저장된 num 과 그림을 RelayArt로 싸서 보내주기만 하면 됨
    public void relay(String roomId,RelayArt art){
    	Room room = rooms.get(roomId);
    	int cycle = room.getCycle();
    	int people = room.getPeople();
    	// key : 그릴 대상의 번호, value : 그림들
    	ConcurrentMap<Integer, List<RelayArt>> map = room.getArt();
    	// 그린 대상의 번호
    	int num = art.getNum()+cycle+1;
    	if(cycle == 0) {
    		List<RelayArt> list = new ArrayList<>();
    		list.add(art);
    		map.put((num)%(people+1), list);
    	}else {
    		map.get((num)%(people+1)).add(art);
    	}
    }
    
    // 그림 전파
    // response map key : 플레이어 번호, value :  이어서 그려야 할 그림
    public Map<Integer,RelayArt> artResponse(String roomId){
    	Room room = rooms.get(roomId);
    	int cycle = room.getCycle();
    	int people = room.getPeople();
    	ConcurrentMap<Integer, List<RelayArt>> map = room.getArt();
    	Map<Integer,RelayArt>tmp= new HashMap<>();
    	for(int i=1;i<=people;i++) {
    		// i 대상의 그림
    		List<RelayArt> art = map.get((i+cycle+1)%(people+1));
    		tmp.put(i, art.get(art.size()-1));
    	}
    	return tmp;
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
