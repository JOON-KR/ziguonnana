package com.ziguonnana.ziguserver.websocket.shorts.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.*;

@AllArgsConstructor
@Getter
public enum ExampleShorts {

    FIRST_SHORTS_PEOPLE1(1,1, Arrays.asList(
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/d569de89-1489-41e4-9801-006f8ee93b41.mp4", 38000)
    )),
    FIRST_SHORTS_PEOPLE2(1, 2, Arrays.asList(
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people2/7ccc004e-2c60-41b0-8932-4c6e636d2a1f-0.mp4", 19000),
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people2/e5b58e19-5a39-4b3d-8a62-0002aaf0049a-1.mp4", 19000)
    )),
    FIRST_SHORTS_PEOPLE3(1, 3, Arrays.asList(
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people3/8945fb26-8003-40ec-b370-3ac17f49bb48-0.mp4", 13000),
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people3/4e8ea454-5839-41cb-ae3d-760f8d244ee4-1.mp4",13000),
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people3/2d7f8342-e607-4f3e-b698-9e19eb3019ae-2.mp4",12000)
    )),
    FIRST_SHORTS_PEOPLE4(1, 4, Arrays.asList(
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people4/4c437547-e241-4565-a586-155e80e63906-0.mp4", 7000),
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people4/20d03fb1-d276-480c-b69b-8c455fbe44ee-1.mp4", 7000),
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people4/a624a64b-a1ea-4ba2-9db8-50d2d22da70a-2.mp4", 7000),
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people4/7c6ddd59-fc02-4f06-9942-0839c580f12e-3.mp4", 13000)
    )),
    FIRST_SHORTS_PEOPLE5(1, 5, Arrays.asList(
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people5/6e39a06e-20c5-4d56-8202-0989b53aadc9-0.mp4", 6000),
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people5/eb1ff0ea-ceca-4d2c-bf83-2e9cdcea1b63-1.mp4", 6000),
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people5/40b6b321-a2c6-4455-a605-c5c684145100-2.mp4", 6000),
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people5/27911c64-abd4-4fbb-9dc8-54b943502b6c-3.mp4", 6000),
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people5/a078f42e-c487-44b9-a3e1-b41256b02ce4-4.mp4", 13000)
    )),
    FIRST_SHORTS_PEOPLE6(1, 6, Arrays.asList(
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people6/ab055552-d079-42f4-94da-ec9b3e3d31a3-0.mp4", 5000),
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people6/e18298b6-ba9b-43c9-866f-0e7e03bd5cc7-1.mp4", 5000),
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people6/63b12e88-c4d9-49ff-b2f3-f953b78de3bf-2.mp4", 5000),
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people6/b3812cfc-c66e-4d72-ae58-cb6f0576fde0-3.mp4", 5000),
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people6/c893971a-8340-4793-8a4a-66f11c0d8080-4.mp4", 5000),
            new ShortsInfo("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/exampleShorts/1/people6/f6394341-d19d-4889-8d2e-3ceb8173cdd4-5.mp4", 13000)
    ));


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
}
