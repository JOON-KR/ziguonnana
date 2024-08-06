package com.ziguonnana.ziguserver.websocket.bodytalk.service;

import com.ziguonnana.ziguserver.websocket.bodytalk.dto.*;
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
        if(room.getCycle() == 0){
            room.getBodyTalkGame().startGame();
        }
        if(room.getCycle()+1 > ROUND){
            // 게임종료
            BodyTalkResult result = gameEnd(room.getBodyTalkGame());
            simpMessagingTemplate.convertAndSend("/topic/game/" + room.getRoomId() + "/bodyTalk/result", result);
            return "게임종료";
        }
        int people = room.getPeople();
        int explanierNum = room.getCycle()%people +1; // 출제자 번호(1부터 시작)
        log.info("출제자 번호: " + explanierNum);
        room.cycleUp();
        log.info("현재 라운드 : " + room.getCycle());
        // 키워드 저장
        Keyword keyword = randomKeyword();
        room.getBodyTalkGame().changeKeyword(keyword);
        simpMessagingTemplate.convertAndSend("/topic/game/" + room.getRoomId() + "/bodyTalk/" + explanierNum, keyword);
        return keyword.getType();
    }

    private BodyTalkResult gameEnd(BodyTalkGame bodyTalkGame){
        // 게임종료
        // 경과 시간 계산
        bodyTalkGame.calculateDurationTime();
        BodyTalkResult result = new BodyTalkResult(bodyTalkGame.getDurationTime(), bodyTalkGame.getCorrectCnt());
        log.info("몸으로 말해요 결과:" + result);
        return result;
    }

    private Keyword randomKeyword(){
        int index = random.nextInt(keywordList.size());
        return keywordList.get(index);
    }

    @Transactional
    public ChatMessage chat(ChatRequest chatRequest, String roomId) {
        BodyTalkGame bodyTalkGame = roomRepository.getRoom(roomId).getBodyTalkGame();
        String answer = bodyTalkGame.getKeyword().getWord();

        //정답이면 점수 카운트 up
        boolean isCorrect = isCorrect(answer, chatRequest.getContent());
        if(isCorrect){
            bodyTalkGame.plusCorrectCnt();
        }
        return new ChatMessage(chatRequest.getSenderNum(), chatRequest.getContent(), isCorrect);
    }

    private boolean isCorrect(String answer, String input){
        // 사용자 입력 공백 제거
        input = input.replace(" ", "");
        return answer.equals(input);
    }


}
