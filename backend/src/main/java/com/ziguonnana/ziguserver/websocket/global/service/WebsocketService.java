package com.ziguonnana.ziguserver.websocket.global.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.exception.RoomException;
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

    public void createRoom(String roomId, CreateRequest request) {
        log.info("----------방 생성 시작 -----------");
        ConcurrentHashMap<Integer, Player> players = new ConcurrentHashMap<>();
        Player player = Player.builder()
                .memberId(request.getMemberId())
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
                .roomId(roomId)
                .build();
        roomRepository.addRoom(roomId, room);
        roomRepository.addMemberToRoom(request.getMemberId(), roomId);
        SessionInfo info = SessionInfo.builder()
                .memberId(request.getMemberId())
                .roomId(roomId)
                .num(player.getNum())
                .build();
        log.info("방 생성 :: roomId : {}, room : {}, player : {}", roomId, room.toString(), player.toString());
        messagingTemplate.convertAndSend("/topic/game/" + roomId + "/" + request.getMemberId(), GameMessage.info("방 생성 완료", info));
    }

    public void createProfile(String roomId, GameProfileRequest request) {
        Room room = getRoom(roomId);
        Player player = room.getPlayers().get(request.getNum());
        GameProfile profile = GameProfile.from(request);
        player.createProfile(profile);

        // 프로필 생성 시 count를 증가시킵니다.
        room.countUp();
        log.info("room people:" + room.getPeople());
        log.info("room count:" + room.getCount());
        // count가 people과 같아지면 게임 시작
        if (room.getCount() == room.getPeople()) {
        	room.countInit();
            startGame(room);
        }
        log.info("프로필 생성 :: roomId : {}, player : {}, profile : {}", roomId, room.toString(), profile.toString());
    }

    public Room getRoom(String roomId) {
        return Optional.ofNullable(roomRepository.getRoom(roomId))
                .orElseThrow(() -> new RoomNotFoundException("방을 찾을 수 없습니다.: " + roomId));
    }

    public Player getPlayer(String roomId, int num) {
        return getRoom(roomId).getPlayers().get(num);
    }

    public void join(String roomId, GameProfile profile, String memberId) {
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
        SessionInfo info = SessionInfo.builder()
                .memberId(memberId)
                .roomId(roomId)
                .num(player.getNum())
                .build();
        log.info("방 참가 :: roomId : {}, player : {}, profile : {}", roomId, room.toString(), profile.toString());
        messagingTemplate.convertAndSend("/topic/game/" + roomId + "/" + memberId, GameMessage.info("방 참가 완료", info));
    }

    public void startGame(Room room) {
        room.initArt();
        // 게임 시작 알림을 클라이언트에 보냅니다.
        List<RelayArt> keywordList = getKeyword(room);
        log.info("------------------게임 시작 ------------------");
        GameMessage<List<RelayArt>> keyword = GameMessage.info("키워드", keywordList);
        messagingTemplate.convertAndSend("/topic/game/" + room.getRoomId(), keyword);
        log.info("game 키워드 발송");
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
            List<String> feature = player.getProfile() != null ? player.getProfile().getFeature() : null;
            List<String> answer = player.getAnswer();

            if (feature != null) {
                combinedList.addAll(feature);
            }

            if (answer != null) {
                combinedList.addAll(answer);
            }

            // 랜덤하게 값을 선택
            if (!combinedList.isEmpty()) {
                String randomKeyword = combinedList.get(random.nextInt(combinedList.size()));
                RelayArt relayArt = RelayArt.builder()
                        .num((i+1)%(people) == 0? i+1:(i+1)%(people) )
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
                .orElseThrow(() -> new RoomException("Member not found in any room: " + memberId));

        Room room = Optional.ofNullable(roomRepository.getRoom(roomId))
                .orElseThrow(() -> new RoomException("Room not found: " + roomId));

        room.getPlayers().remove(memberId);
        if (room.getPlayers().isEmpty()) {
            roomRepository.removeRoom(roomId);
        }
    }

    public List<Room> getAllRooms() {
        return new ArrayList<>(roomRepository.getAllRooms().values());
    }
}
