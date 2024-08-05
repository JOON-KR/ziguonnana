package com.ziguonnana.ziguserver.websocket.bodytalk.service;

import com.ziguonnana.ziguserver.websocket.bodytalk.dto.ChatMessage;
import com.ziguonnana.ziguserver.websocket.bodytalk.dto.ChatRequest;
import com.ziguonnana.ziguserver.websocket.bodytalk.dto.Keyword;
import com.ziguonnana.ziguserver.websocket.bodytalk.dto.KeywordConstants;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class BodyTalkService {
    private static final int ROUND = 6;

    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final List<Keyword> keywordList = KeywordConstants.KEYWORD_LIST;
    private final Random random = new Random();

    // 출제자 선정
    // 키워드 타입 전달
    @Transactional
    public String decideKeywordExplanier(String roomId){
        Room room = roomRepository.getRoom(roomId);
        int people = room.getPeople();
        int explanierNum = room.getCycle()%people +1; // 출제자 번호(1부터 시작)
        log.info("출제자 번호: " + explanierNum);
        room.cycleUp();
        if(room.getCycle() >= ROUND){
            // 게임종료
        }
        Keyword keyword = randomKeyword();
        simpMessagingTemplate.convertAndSend("/topic/game/" + room.getRoomId() + "/bodyTalk/" + explanierNum, keyword);
        return keyword.getType();
    }

    private Keyword randomKeyword(){
        int index = random.nextInt(keywordList.size());
        return keywordList.get(index);
    }

    public ChatMessage chat(ChatRequest chatRequest) {
        return new ChatMessage(chatRequest.getSenderNum(), chatRequest.getContent());
    }
}
