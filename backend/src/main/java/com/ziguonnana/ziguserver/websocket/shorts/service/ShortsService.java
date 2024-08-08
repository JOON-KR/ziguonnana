package com.ziguonnana.ziguserver.websocket.shorts.service;


import com.ziguonnana.ziguserver.websocket.global.dto.Room;
import com.ziguonnana.ziguserver.websocket.repository.RoomRepository;
import com.ziguonnana.ziguserver.websocket.shorts.dto.Shorts;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShortsService {
    private final RoomRepository roomRepository;

    public synchronized void selectVideo(String roomId, int shortsId){
        Room room = roomRepository.getRoom(roomId);
        if(room.getShortsRequestCnt() > 0) {
            log.info("========= 예시 영상 선택 요청 여러번 ======");
            return; // 여러번 요청들어오면 한번 외에는 무시
        }
        // 쇼츠 선택 request cnt 증가
        room.countShortsRequestCnt();
        Shorts shorts = room.getShorts();
        if(shortsId > 3 || shortsId <= 0) return;

        // 숏츠 id와 인원수에 따라 분할된 예시 영상 url 세팅
        shorts.setExampleVideoInfo(shortsId, room.getPeople());
        log.info("해당 숏츠 id의 분할된 예시 영상 리스트: " + shorts.getSplitedExampleVideoUrl());
    }

    public String sendSplitVideoByUserNum(String roomId, int userNum){
        Room room = roomRepository.getRoom(roomId);
        Shorts shorts = room.getShorts();
        String splitedVideoUrl = shorts.getSplitedExampleVideoUrl().get(userNum - 1);
        return splitedVideoUrl;
    }
    
}
