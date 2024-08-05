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

import java.util.UUID;


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
        // 세션 생성
        Session session = openvidu.createSession();
        log.info("session id(roomId)" + session.getSessionId());
        log.info("session properties(roomId)" + session.getProperties().toJson());
        return new RoomInviteResponse(session.getSessionId());
    }

    public RoomResponse connectRoom(String roomId) throws OpenViduJavaClientException, OpenViduHttpException {
        openvidu.fetch();
        log.info("connection roomID: " + roomId);
        Session session = openvidu.getActiveSession(roomId);
        log.info("Active Sessions: " + openvidu.getActiveSessions().toString());
        if(session == null) throw new OpenviduException(ErrorCode.SESSION_NOT_FOUND);

        Connection connection = session.createConnection();
        log.info("connection count : " + session.getActiveConnections().size());
        log.info("openviduToken : " + connection.getToken());
        // memberId UUID로 생성
        String memberId = UUID.randomUUID().toString();
        return new RoomResponse(connection.getToken(), memberId);
    }
}
