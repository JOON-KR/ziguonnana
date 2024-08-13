package com.ziguonnana.ziguserver.websocket.igudongseong.dto;

import java.util.Random;

public enum IgudongseongKeyword {
    호날두, 오토바이, 토끼, 슈퍼맨, 승리, 댑, 하트, 경례, 춤,
    로봇, 해적, 스파이더맨, 복싱, 손흔들기, 엄지척, 락온, 브이, 하이파이브,
    생각중, 서핑, 수영, 달리기, 점프, 요가, 명상, 근육, 쉿,
    평화, 기도, 소리질러, 박수, 웃음, 울음,
    악수, 윙크, 손가락하트, 방패, 칼싸움, 선글라스,
    전화걸기, 미소, 포옹, 무릎, 상어, 촛불, 우산,
    오리, 여우, 고양이, 개구리, 나비, 사자, 호랑이, 곰, 펭귄,
    코끼리, 기린, 하트날리기, 물총쏘기, 수박, 삼각김밥, 빨대,
    구름, 별, 달, 태양, 번개, 비, 눈, 바람, 바다,
    산, 강, 나무, 꽃, 잎, 물고기, 새, 벌, 거북이,
    공룡, UFO, 로켓, 자동차, 버스, 비행기, 기차, 배, 자전거,
    헬리콥터, 택시, 트럭, 스케이트보드, 롤러코스터, 돼지, 말, 닭, 양, 염소,
    노래하기, 피아노, 기타, 드럼, 바이올린, 플루트, 트럼펫, 색소폰, 첼로, 하모니카;

    private static final Random RANDOM = new Random();

    public static IgudongseongKeyword getRandomKeyword() {
        IgudongseongKeyword[] keywords = values();
        return keywords[RANDOM.nextInt(keywords.length)];
    }
}
