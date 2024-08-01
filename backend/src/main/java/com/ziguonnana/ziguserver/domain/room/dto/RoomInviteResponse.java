package com.ziguonnana.ziguserver.domain.room.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomInviteResponse {
    private String teamCode;
    private String roomId;
}
