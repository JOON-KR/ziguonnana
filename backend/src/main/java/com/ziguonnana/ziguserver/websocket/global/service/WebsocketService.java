package com.ziguonnana.ziguserver.websocket.global.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.exception.RoomNotFoundException;
import com.ziguonnana.ziguserver.websocket.art.dto.RelayArt;
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
        ConcurrentHashMap<Integer, Player> players = new ConcurrentHashMap<>();
        String memberId = UUID.randomUUID().toString();
        Player player = Player.builder()
                .memberId(memberId)
                .role("admin")
                .roomId(roomId)
                .num(1)
                .build();
        players.put(1, player);
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
        log.info("방 생성 :: roomId : {}, room : {}, player : {}" , roomId, room.toString(), player.toString() );
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
        log.info("프로필 생성 :: roomId : {}, player : {}, profile : {}" , roomId, room.toString(), profile.toString());
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
        log.info("방 참가 :: roomId : {}, player : {}, profile : {}" , roomId, room.toString(), profile.toString());
    }

    public void startGame(Room room) {
        room.initArt();
        // 게임 시작 알림을 클라이언트에 보냅니다.
        List<RelayArt>keywordList = getKeyword(room);
        
        GameMessage<List<RelayArt>> keyword = GameMessage.info("키워드", keywordList);
        messagingTemplate.convertAndSend("/topic/game/" + room.getRoomId(), keyword);
        boolean start = true;
        GameMessage<Boolean> startMessage = GameMessage.info("게임 시작!", start);
        messagingTemplate.convertAndSend("/topic/game/" + room.getRoomId(), startMessage);
    }
    
    public List<RelayArt> getKeyword(Room room) {
        int people = room.getPeople();
        ConcurrentMap<Integer, Player> players = room.getPlayers();
        List<RelayArt> relayArts = new ArrayList<>();
        Random random = new Random();

        for (int i = 1; i <= people; i++) {
            Player player = players.get(i);
            List<String> combinedList = new ArrayList<>();
            
            // feature와 answer 리스트를 결합
            String[] feature = player.getProfile().getFeature();
            List<String> answer = player.getAnswer();
            for (String f : feature) combinedList.add(f);
            combinedList.addAll(answer);

            // 랜덤하게 값을 선택
            if (!combinedList.isEmpty()) {
                String randomKeyword = combinedList.get(random.nextInt(combinedList.size()));
                RelayArt relayArt = RelayArt.builder()
                		.num(i)
                		.keyword(randomKeyword)
                		.build();
                relayArts.add(relayArt);
            }
        }

        return relayArts;
    }

    public void addPlayerToRoom(String roomId, Player player) {
        Room room = getRoom(roomId);

        if (room.getPlayers().size() < room.getPeople()) {
            room.getPlayers().put(player.getNum(), player);
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
