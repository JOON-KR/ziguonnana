package com.ziguonnana.ziguserver.domain.member;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class EmailListResponse {
    private List<String> emails;
}
