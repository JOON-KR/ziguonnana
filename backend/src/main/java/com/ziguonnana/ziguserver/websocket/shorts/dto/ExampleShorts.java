package com.ziguonnana.ziguserver.websocket.shorts.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.*;

@AllArgsConstructor
@Getter
public enum ExampleShorts {
    FIRST_SHORTS_PEOPLE6(1, 6, Arrays.asList(
            "https://ziguonnana.s3.ap-northeast-2.amazonaws.com/split/18d2f65d-8e9c-4a29-8780-a1aa0822ec93.mp4",
            "https://ziguonnana.s3.ap-northeast-2.amazonaws.com/split/480f6ce9-ff6d-42e6-8fcd-62892a77b05d.mp4",
            "https://ziguonnana.s3.ap-northeast-2.amazonaws.com/split/55de0b70-77db-4d9e-aaad-941eb65512d8.mp4",
            "https://ziguonnana.s3.ap-northeast-2.amazonaws.com/split/9995c86a-d853-4feb-81ea-985c27421ad4.mp4",
            "https://ziguonnana.s3.ap-northeast-2.amazonaws.com/split/9dd9581c-0954-4adc-9aaa-98813afa3ddc.mp4",
            "https://ziguonnana.s3.ap-northeast-2.amazonaws.com/split/b232b329-d139-4288-8e72-288965e57f31.mp4"));

    private final int shortsId;
    private final int people;
    private final List<String> exampleShortsUrl;

    public static List<String> getUrlsByShortsIdAndPeople(int shortsId, int people) {
        // Optional을 사용하여 특정 조건을 만족하는 enum 값을 찾기
        // match가 존재하면 해당 URL 리스트를 반환하고, 그렇지 않으면 빈 리스트를 반환
        return Arrays.stream(ExampleShorts.values())
                .filter(e -> e.getShortsId() == shortsId && e.getPeople() == people)
                .findFirst()
                .map(ExampleShorts::getExampleShortsUrl)
                .orElse(Collections.emptyList());
    }
}
