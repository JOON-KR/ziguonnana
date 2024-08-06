package com.ziguonnana.ziguserver.websocket.answer.dto;

public enum SelfIntroductionQuestion {
    QUESTION1("사람들이 나를 닮았다고 하는 연예인은 누구인가요?"),
    QUESTION2("주변 사람들에게 자주 듣는 외모에 대한 칭찬은 무엇인가요?"),
    QUESTION3("자주 듣는 별명은 무엇인가요?"),
    QUESTION4("가장 자신 있는 신체 부위는 어디인가요?"),
    QUESTION5("외모 중에서 바꾸고 싶은 부분이 있나요? 있다면 어디인가요?"),
    QUESTION6("주변 사람들이 나를 보고 가장 먼저 하는 말은 무엇인가요?"),
    QUESTION7("가장 좋아하는 스타일이나 패션 아이템은 무엇인가요?"),
    QUESTION8("머리 스타일을 자주 바꾸는 편인가요?"),
    QUESTION9("가장 최근에 들은 외모에 대한 칭찬은 무엇인가요?"),
    QUESTION10("외모와 관련된 에피소드가 있다면 들려주세요."),
    QUESTION11("가장 좋아하는 패션 브랜드는 무엇인가요?"),
    QUESTION12("본인의 외모 중에서 가장 마음에 드는 부분은 어디인가요?"),
    QUESTION13("자주 듣는 외모 관련 별명이 있나요?"),
    QUESTION14("외모 관리 비법이 있다면 무엇인가요?"),
    QUESTION15("가장 좋아하는 향수나 화장품은 무엇인가요?"),
    QUESTION16("외모와 관련하여 가장 자신 있는 부분은 무엇인가요?"),
    QUESTION17("사람들이 나를 처음 보면 어떤 인상을 받는다고 하나요?"),
    QUESTION18("가장 좋아하는 헤어 스타일은 무엇인가요?"),
    QUESTION19("외모와 관련하여 사람들이 자주 묻는 질문은 무엇인가요?"),
    QUESTION20("외모와 관련된 스트레스를 받는 부분이 있나요? 있다면 어디인가요?");

    private final String question;

    SelfIntroductionQuestion(String question) {
        this.question = question;
    }

    public String getQuestion() {
        return question;
    }
}
