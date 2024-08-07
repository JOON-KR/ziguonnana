package com.ziguonnana.ziguserver.websocket.global.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.exception.RoomException;
import com.ziguonnana.ziguserver.exception.RoomNotFoundException;
import com.ziguonnana.ziguserver.websocket.answer.service.AnswerService;
import com.ziguonnana.ziguserver.websocket.bodytalk.dto.BodyTalkGame;
import com.ziguonnana.ziguserver.websocket.global.dto.CreateRequest;
import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;
import com.ziguonnana.ziguserver.websocket.global.dto.GameProfile;
import com.ziguonnana.ziguserver.websocket.global.dto.GameProfileRequest;
import com.ziguonnana.ziguserver.websocket.global.dto.Player;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.global.dto.SessionInfo;
import com.ziguonnana.ziguserver.websocket.igudongseong.dto.IgudongseongResult;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class WebsocketService {
    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final AnswerService answerService;
    
    public void createRoom(String roomId, CreateRequest request) {
        log.info("----------웹소켓 방 생성 시작 -----------");
        ConcurrentHashMap<Integer, Player> players = new ConcurrentHashMap<>();
        ConcurrentHashMap<Integer, List<Double>> vector= new ConcurrentHashMap<>();
        List<IgudongseongResult> Igudongseong = new ArrayList<>();
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
                .bodyTalkGame(new BodyTalkGame())
                .vectors(vector)
                .Igudongseong(Igudongseong)
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

    public void join(String roomId,  String memberId) {
        Room room = getRoom(roomId);

        Player player = Player.builder()
                .memberId(memberId)
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
        log.info("방 참가 :: roomId : {}, player : {}", roomId, room.toString());
        messagingTemplate.convertAndSend("/topic/game/" + roomId + "/" + memberId, GameMessage.info("방 참가 완료", info));
    }

    public void startGame(Room room) {
        room.initArt();
        // 게임 시작 알림을 클라이언트에 보냅니다.
        log.info("------------------게임 시작 ------------------");
        boolean start = true;
        GameMessage<Boolean> startMessage = GameMessage.info("게임 시작!", start);
        messagingTemplate.convertAndSend("/topic/game/" + room.getRoomId(), startMessage);
        
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
