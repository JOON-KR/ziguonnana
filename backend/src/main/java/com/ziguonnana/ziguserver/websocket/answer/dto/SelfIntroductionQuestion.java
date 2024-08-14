package com.ziguonnana.ziguserver.websocket.answer.dto;

public enum SelfIntroductionQuestion {
	QUESTION1("큰 눈인가요, 작은 눈인가요?"),
	QUESTION2("쌍꺼풀이 있나요, 없나요?"),
	QUESTION3("높은 코인가요, 낮은 코인가요?"),
	QUESTION4("두꺼운 입술인가요, 얇은 입술인가요?"),
	QUESTION5("둥근 얼굴형인가요, 각진 얼굴형인가요?"),
	QUESTION6("밝은 피부톤인가요, 어두운 피부톤인가요?"),
	QUESTION7("진한 눈썹인가요, 연한 눈썹인가요?"),
	QUESTION8("긴 머리인가요, 짧은 머리인가요?"),
	QUESTION9("검은 머리인가요, 갈색 머리인가요?"),
	QUESTION10("직모인가요, 곱슬머리인가요?"),
	QUESTION11("큰 귀인가요, 작은 귀인가요?"),
	QUESTION12("좁은 이마인가요, 넓은 이마인가요?"),
	QUESTION13("날렵한 턱선인가요, 둥근 턱선인가요?"),
	QUESTION14("크고 둥근 눈인가요, 작고 날카로운 눈인가요?"),
	QUESTION15("검은 눈동자인가요, 갈색 눈동자인가요?"),
	QUESTION16("큰 입인가요, 작은 입인가요?"),
	QUESTION17("올라간 눈꼬리인가요, 내려간 눈꼬리인가요?"),
	QUESTION18("넓은 콧볼인가요, 좁은 콧볼인가요?"),
	QUESTION19("마른 체형인가요, 통통한 체형인가요?"),
	QUESTION20("진한 헤어라인인가요, 연한 헤어라인인가요?"),
	QUESTION21("눈이 날카로운가요, 부드러운가요?"),
	QUESTION22("턱에 보조개가 있나요, 없나요?"),
	QUESTION23("피부가 건성인가요, 지성인가요?"),
	QUESTION24("머리가 곱슬인가요, 직모인가요?"),
	QUESTION25("코가 긴가요, 짧은가요?"),
	QUESTION26("웃을 때 보조개가 있나요, 없나요?"),
	QUESTION27("피부가 하얀가요, 검은가요?"),
	QUESTION28("눈썹이 길고 풍성한가요, 짧고 얇은가요?"),
	QUESTION29("피부에 점이 있나요, 없나요?"),
	QUESTION30("입꼬리가 올라갔나요, 내려갔나요?"),
	QUESTION31("얼굴에 홍조가 있나요, 없나요?"),
	QUESTION32("콧등이 높은가요, 낮은가요?"),
	QUESTION33("얼굴형이 계란형인가요, 각진형인가요?"),
	QUESTION34("눈동자가 밝은가요, 어두운가요?"),
	QUESTION35("웃을 때 눈가에 주름이 있나요, 없나요?"),
	QUESTION36("손톱이 길게 자라나요, 짧게 자라나요?"),
	QUESTION37("머리가 뻗친가요, 차분한가요?"),
	QUESTION38("앞머리가 있나요, 없나요?"),
	QUESTION39("눈꼬리가 올라갔나요, 내려갔나요?"),
	QUESTION40("머리숱이 풍성한가요, 적은가요?"),
	QUESTION41("눈동자가 둥근가요, 납작한가요?"),
	QUESTION42("팔뚝이 탄탄한가요, 부드러운가요?"),
	QUESTION43("어깨가 넓은가요, 좁은가요?"),
	QUESTION44("다리에 근육이 많은가요, 적은가요?"),
	QUESTION45("콧등이 뾰족한가요, 넓은가요?"),
	QUESTION46("입술이 촉촉한가요, 건조한가요?"),
	QUESTION47("눈동자가 큰가요, 작은가요?"),
	QUESTION48("광대뼈가 넓은가요, 좁은가요?"),
	QUESTION49("머리카락이 길어요, 짧아요?"),
	QUESTION50("머리 스타일이 파마인가요, 생머리인가요?"),
	QUESTION51("콧구멍이 넓은가요, 좁은가요?");



    private final String question;

    SelfIntroductionQuestion(String question) {
        this.question = question;
    }

    public String getQuestion() {
        return question;
    }
}
