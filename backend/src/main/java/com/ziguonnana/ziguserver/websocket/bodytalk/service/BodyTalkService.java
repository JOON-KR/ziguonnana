package com.ziguonnana.ziguserver.websocket.bodytalk.service;

import com.ziguonnana.ziguserver.exception.BodyTalkException;
import com.ziguonnana.ziguserver.exception.ErrorCode;
import com.ziguonnana.ziguserver.websocket.bodytalk.dto.*;
import com.ziguonnana.ziguserver.websocket.global.dto.CommandType;
import com.ziguonnana.ziguserver.websocket.global.dto.Response;
import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

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
    private int keywordReq = 0;

    // 출제자 선정
    // 키워드 타입 전달
    public synchronized String decideKeywordExplanier(String roomId){
        if(keywordReq != 0) throw new BodyTalkException(ErrorCode.BODYTALK_KEYWORD_REQUEST);
        // 처음 요청일 때만 수행
        keywordReq++;
        Room room = roomRepository.getRoom(roomId);
        if(room.getCycle() == 0){
            room.getBodyTalkGame().startGame();
        }
        if(room.getCycle()+1 > ROUND){
            // 게임종료
            BodyTalkResult result = gameEnd(room.getBodyTalkGame());
            Response response = Response.ok(CommandType.BODYGAME_RESULT, result);
            simpMessagingTemplate.convertAndSend("/topic/game/" + room.getRoomId(), response);
            room.cycleInit(); //사이클(라운드) 초기화
            keywordReq = 0; // 키워드 요청 초기화
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
        Response response  = Response.ok(CommandType.BODYGAME_EXPLANIER, keyword);
        simpMessagingTemplate.convertAndSend("/topic/game/" + room.getRoomId() + "/" + explanierNum, response);
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

    public BodyChatMessage chat(BodyChatRequest bodyChatRequest, String roomId) {
        BodyTalkGame bodyTalkGame = roomRepository.getRoom(roomId).getBodyTalkGame();
        String answer = bodyTalkGame.getKeyword().getWord();

        //정답이면 점수 카운트 up
        boolean isCorrect = isCorrect(answer, bodyChatRequest.getContent());
        if(isCorrect){
            bodyTalkGame.plusCorrectCnt();
        }
        return new BodyChatMessage(bodyChatRequest.getSenderNum(), bodyChatRequest.getContent(), isCorrect);
    }

    private boolean isCorrect(String answer, String input){
        // 사용자 입력 공백 제거
        input = input.replace(" ", "");
        return answer.equals(input);
    }


}
