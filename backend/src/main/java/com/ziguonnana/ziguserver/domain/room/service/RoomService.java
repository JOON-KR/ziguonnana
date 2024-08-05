package com.ziguonnana.ziguserver.domain.room.service;

import com.google.gson.JsonObject;
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
        Map<String, Object> params = new HashMap<>();
        params.put("people", roomRequest.getPeople());
        params.put("teamName", roomRequest.getTeamName());
        SessionProperties properties = SessionProperties.fromJson(params).build();

        // 세션 생성
        Session session = openvidu.createSession(properties);
        log.info("session id(roomId)" + session.getSessionId());
        log.info("session properties(roomId)" + session.getProperties());
        return new RoomInviteResponse(session.getSessionId());
    }

    public RoomResponse connectRoom(String roomId) throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(roomId);
        if(session == null) throw new OpenviduException(ErrorCode.SESSION_NOT_FOUND);
        // 방장이 설정한 인원수가 connection이 많으면 예외처리
        SessionProperties sessionProperties = session.getProperties();
        JsonObject properties = sessionProperties.toJson();
        int people = properties.get("people").getAsInt();
        if(session.getActiveConnections().size() == people){
            throw new OpenviduException(ErrorCode.ROOM_PEOPLE_LIMIT);
        }
        Connection connection = session.createConnection();
        log.info("connection count : " + session.getActiveConnections().size());
        log.info("openviduToken : " + connection.getToken());
        return new RoomResponse(connection.getToken());
    }
}
