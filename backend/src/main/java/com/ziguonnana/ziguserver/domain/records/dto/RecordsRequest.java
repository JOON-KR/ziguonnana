package com.ziguonnana.ziguserver.domain.records.dto;

import com.ziguonnana.ziguserver.domain.records.entity.Records;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecordsRequest {
    private String resultImage;

    public static RecordsRequest from(Records records) {
        return RecordsRequest.builder()
                .resultImage(records.getResultImage())
                .build();
    }
}
