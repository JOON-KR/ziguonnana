package com.ziguonnana.ziguserver.websocket.shorts.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.*;

@AllArgsConstructor
@Getter
@Slf4j
public enum ExampleShorts {

    FIRST_SHORTS_PEOPLE1(1,1, new ArrayList<>()),
    FIRST_SHORTS_PEOPLE2(1, 2, new ArrayList<>()),
    FIRST_SHORTS_PEOPLE3(1, 3, new ArrayList<>()),
    FIRST_SHORTS_PEOPLE4(1, 4, new ArrayList<>()),
    FIRST_SHORTS_PEOPLE5(1, 5, new ArrayList<>()),
    FIRST_SHORTS_PEOPLE6(1, 6, new ArrayList<>()),
    SECOND_SHORTS_PEOPLE1(2, 1, new ArrayList<>()),
    SECOND_SHORTS_PEOPLE2(2, 2, new ArrayList<>()),
    SECOND_SHORTS_PEOPLE3(2, 3, new ArrayList<>()),
    SECOND_SHORTS_PEOPLE4(2, 4, new ArrayList<>()),
    SECOND_SHORTS_PEOPLE5(2, 5, new ArrayList<>()),
    SECOND_SHORTS_PEOPLE6(2, 6, new ArrayList<>());


    private final int shortsId;
    private final int people;
    private final List<ShortsInfo> exampleShortsUrl;

    public static List<ShortsInfo> getUrlsByShortsIdAndPeople(int shortsId, int people) {
        // Optional을 사용하여 특정 조건을 만족하는 enum 값을 찾기
        // match가 존재하면 해당 URL 리스트를 반환하고, 그렇지 않으면 빈 리스트를 반환
        return Arrays.stream(ExampleShorts.values())
                .filter(e -> e.getShortsId() == shortsId && e.getPeople() == people)
                .findFirst()
                .map(ExampleShorts::getExampleShortsUrl)
                .orElse(Collections.emptyList());
    }

    @Component
    public static class ExampleShortsConfig {

        @Value("${exampleshorts_path}")
        private String CONFIG_FILE;

        @PostConstruct
        public void loadConfig() {
            log.info("숏츠 예시 분할 영상 세팅");
            ObjectMapper mapper = new ObjectMapper();
            try {
                Map<String, List<ShortsInfo>> data = mapper.readValue(new File(CONFIG_FILE), new TypeReference<>() {
                });
                for (ExampleShorts exampleShorts : ExampleShorts.values()) {
                    String key = exampleShorts.getShortsId() + "_SHORTS_PEOPLE" + exampleShorts.getPeople();
                    exampleShorts.exampleShortsUrl.addAll(data.getOrDefault(key, Collections.emptyList()));
                }
                log.info("숏츠 예시 영상 세팅 완료");
            } catch (IOException e) {
                log.info(e.getMessage() + ": 숏츠 예시 영상 세팅 오류");
            }
        }
    }
}
