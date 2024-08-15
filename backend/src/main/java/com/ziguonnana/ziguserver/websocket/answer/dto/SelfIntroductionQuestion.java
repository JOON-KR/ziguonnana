package com.ziguonnana.ziguserver.websocket.answer.dto;

public enum SelfIntroductionQuestion {
	    QUESTION1("좋아하는 색깔은 무엇인가요?"),
	    QUESTION2("자주 하는 헤어스타일은 무엇인가요? (ex: 생머리, 파마)"),
	    QUESTION3("좋아하는 악세사리가 무엇인가요? (ex: 귀걸이, 목걸이, 시계)"),
	    QUESTION4("얼굴형이 무엇인가요? (ex: 각진형, 둥근형)"),
	    QUESTION5("본인의 추구미는 무엇인가요? (ex: 시크, 청순, 건강)"),
	    QUESTION6("가장 자신있는 얼굴 특징을 설명해주세요. (ex: 큰 눈, 오똑한 코)"),
	    QUESTION7("자주 입는 옷 스타일은 무엇인가요? (ex: 캐주얼, 정장)"),
	    QUESTION8("본인과 닮은 동물을 한 가지만 말해주세요. (ex: 강아지, 고양이, 토끼)"),
	    QUESTION9("본인과 더 가까운 단어 한 가지만 고르세요. (앞머리 있 vs 앞머리 없)"),
	    QUESTION10("본인과 더 가까운 단어 한 가지만 고르세요. (안경 vs 노안경)"),
	    QUESTION11("본인과 더 가까운 단어 한 가지만 고르세요. (하얀 피부 vs 검은 피부)");



    private final String question;

    SelfIntroductionQuestion(String question) {
        this.question = question;
    }

    public String getQuestion() {
        return question;
    }
}
