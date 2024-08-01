package com.ziguonnana.ziguserver.domain.team.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeamInviteResponse {
    private String teamCode;
    private String sessionId;
}
