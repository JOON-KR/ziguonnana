package com.ziguonnana.ziguserver.domain.team.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TeamRequest {
    private String teamName;
    private int people;
}
