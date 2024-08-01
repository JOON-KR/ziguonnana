package com.ziguonnana.ziguserver.domain.team.service;

import com.ziguonnana.ziguserver.domain.team.dto.TeamRequest;
import com.ziguonnana.ziguserver.domain.team.dto.TeamInviteResponse;
import com.ziguonnana.ziguserver.domain.team.dto.TeamResponse;
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
public class TeamService {
    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }


    public TeamInviteResponse createTeam(TeamRequest teamRequest) throws OpenViduJavaClientException, OpenViduHttpException {
        // 10자 내외 회의 초대 코드 생성 - UUID
        String teamCode = "uuid";
        // 세션 속성 지정
        Map<String, String> params = new HashMap<>();
        params.put("uuid", teamCode);
        SessionProperties properties = SessionProperties.fromJson(params).build();

        // 세션 생성
        Session session = openvidu.createSession(properties);
        log.info("session id:" + session.getSessionId());
        return new TeamInviteResponse(teamCode, session.getSessionId());
    }

    public TeamResponse connectTeam(String sessionId) throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(sessionId);
        if(session == null) throw new OpenviduException(ErrorCode.SESSION_NOT_FOUND);
        Connection connection = session.createConnection();
        log.info("token : " + connection.getToken());
        return new TeamResponse(connection.getToken());
    }
}
