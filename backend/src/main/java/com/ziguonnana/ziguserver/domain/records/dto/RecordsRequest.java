package com.ziguonnana.ziguserver.domain.records.dto;

import com.ziguonnana.ziguserver.domain.records.entity.Records;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecordsRequest {
    private String resultImage;

    public static RecordsRequest from(Records records) {
        return RecordsRequest.builder()
                .resultImage(records.getResultImage())
                .build();
    }
}
