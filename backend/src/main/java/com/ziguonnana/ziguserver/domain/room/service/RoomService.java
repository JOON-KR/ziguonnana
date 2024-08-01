package com.ziguonnana.ziguserver.domain.room.service;

import com.ziguonnana.ziguserver.domain.room.dto.RoomRequest;
import com.ziguonnana.ziguserver.domain.room.dto.RoomInviteResponse;
import com.ziguonnana.ziguserver.domain.room.dto.RoomResponse;
import com.ziguonnana.ziguserver.exception.ErrorCode;
import com.ziguonnana.ziguserver.exception.OpenviduException;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class RoomService {
    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }


    public RoomInviteResponse createRoom(RoomRequest roomRequest) throws OpenViduJavaClientException, OpenViduHttpException {
        // 10자 내외 회의 초대 코드 생성 - UUID
        String teamCode = "uuid";
        // 세션 속성 지정
        Map<String, String> params = new HashMap<>();
        params.put("uuid", teamCode);
        SessionProperties properties = SessionProperties.fromJson(params).build();

        // 세션 생성
        Session session = openvidu.createSession(properties);
        log.info("session id(roomId)" + session.getSessionId());
        return new RoomInviteResponse(teamCode, session.getSessionId());
    }

    public RoomResponse connectRoom(String roomId) throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(roomId);
        if(session == null) throw new OpenviduException(ErrorCode.SESSION_NOT_FOUND);
        // 방장이 설정한 인원수가 connection이 많으면 예외처리
        Connection connection = session.createConnection();
        log.info("token : " + connection.getToken());
        return new RoomResponse(connection.getToken());
    }
}
