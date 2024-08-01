package com.ziguonnana.ziguserver.domain.team.controller;

import com.ziguonnana.ziguserver.domain.team.dto.TeamRequest;
import com.ziguonnana.ziguserver.domain.team.dto.TeamInviteResponse;
import com.ziguonnana.ziguserver.domain.team.dto.TeamResponse;
import com.ziguonnana.ziguserver.domain.team.service.TeamService;
import com.ziguonnana.ziguserver.global.ResponseDto;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequiredArgsConstructor
@RequestMapping("/api/v1/team")
public class TeamController {
    private final TeamService teamService;

    // 회의 방 생성 - 이글루 생성
    @PostMapping()
    public ResponseEntity<ResponseDto<TeamInviteResponse>> createTeam(@RequestBody TeamRequest teamRequest) throws OpenViduJavaClientException, OpenViduHttpException {
        TeamInviteResponse response = teamService.createTeam(teamRequest);
        return ResponseEntity.status(201).body(ResponseDto.success(response));
    }

    // 회의 참가
    @PostMapping("{sessionId}")
    public ResponseEntity<ResponseDto<TeamResponse>> connectTeam(@PathVariable("sessionId") String sessionId) throws OpenViduJavaClientException, OpenViduHttpException {
        TeamResponse response = teamService.connectTeam(sessionId);
        return ResponseEntity.ok().body(ResponseDto.success(response));
    }
}
