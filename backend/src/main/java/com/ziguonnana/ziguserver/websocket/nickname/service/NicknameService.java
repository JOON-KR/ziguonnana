package com.ziguonnana.ziguserver.websocket.nickname.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ConcurrentMap;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.ziguonnana.ziguserver.security.exception.MemberNotFoundException;
import com.ziguonnana.ziguserver.websocket.global.dto.GameMessage;
import com.ziguonnana.ziguserver.websocket.global.dto.Player;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.nickname.dto.Adjective;
import com.ziguonnana.ziguserver.websocket.nickname.dto.AnimalName;
import com.ziguonnana.ziguserver.websocket.nickname.dto.FutureName;
import com.ziguonnana.ziguserver.websocket.nickname.dto.JoseonName;
import com.ziguonnana.ziguserver.websocket.nickname.dto.MedievalName;
import com.ziguonnana.ziguserver.websocket.nickname.dto.Nickname;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NicknameService {
    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private static final Random RANDOM = new Random();
    
    public void create(String roomId, Nickname request) {
        Room room = roomRepository.getRoom(roomId);

        Player player = room.getPlayers().get(request.getNum());
        if (player == null) {
            throw new MemberNotFoundException("Player를 찾을 수 없습니다.");
        }

        String nickname = nicknameBuilder(request.getStyle());
        player.createNickname(nickname);

        room.countUp();
        if (room.getCount() == room.getPeople()) {
            spreadName(roomId);
            room.countInit();
        }
    }

    private String nicknameBuilder(String style) {
        Adjective adjective = Adjective.values()[RANDOM.nextInt(Adjective.values().length)];
        switch (style) {
            case "중세":
                MedievalName medievalName = MedievalName.values()[RANDOM.nextInt(MedievalName.values().length)];
                return adjective.name() + " " + medievalName.name();
            case "미래":
                FutureName futureName = FutureName.values()[RANDOM.nextInt(FutureName.values().length)];
                return adjective.name() + " " + futureName.name();
            case "조선":
                JoseonName joseonName = JoseonName.values()[RANDOM.nextInt(JoseonName.values().length)];
                return adjective.name() + " " + joseonName.name();
            case "동물":
                AnimalName animalName = AnimalName.values()[RANDOM.nextInt(AnimalName.values().length)];
                return adjective.name() + " " + animalName.name();
            default:
                throw new IllegalArgumentException("Unknown style: " + style);
        }
    }

    private void spreadName(String roomId) {
        Room room = roomRepository.getRoom(roomId);
        int people = room.getPeople();
        List<Nickname>list = new ArrayList<>();
        ConcurrentMap<Integer, Player>players = room.getPlayers();
        for(int i=1;i<=people;i++) {
        	Nickname name = Nickname.builder()
        			.nickname(players.get(i).getNickname())
        			.num(i)
        			.build();
        	list.add(name);
        }
        messagingTemplate.convertAndSend("/topic/game/" + roomId, GameMessage.info("별명 전파", list));
    }
}
