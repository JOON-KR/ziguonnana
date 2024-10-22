package com.ziguonnana.ziguserver.websocket.shorts.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class Shorts {
    private int shortsId;
    private List<ShortsInfo> splitedExampleVideoUrl;
    private List<String> userSplitedVideoUrl;

    public void setExampleVideoInfo(int shortsId, int people){
        this.shortsId = shortsId;
        this.splitedExampleVideoUrl = ExampleShorts.getUrlsByShortsIdAndPeople(shortsId, people);
    }

}
