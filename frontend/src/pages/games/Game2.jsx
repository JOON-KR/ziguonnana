import React, { useEffect, useState } from "react";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import styled from "styled-components";
import orange from "../../assets/icons/orange.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SpeechBubble from "../../components/speechBubble/SpeechBubble";
import bigNana from "../../assets/images/bigNana.png";

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const FormWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChatWrap = styled.div`
  /* width: 60%; */
`;

const ExplainerWrap = styled.div`
  width: 600px;
  border-radius: 10px;
  height: 155px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const QuestionerWrap = styled.div`
  width: 600px;
  border-radius: 10px;
  position: fixed;
  bottom: 30px;
  flex-direction: column;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #ebeef1;
`;

// 몸으로 말해요 페이지 (BodyTalk)

const Game2 = () => {
  const [isBodyTalkWelcomeModalOpen, setIsBodyTalkWelcomeModalOpen] =
    useState(true);
  const [isBodyTalkGuideModalOpen, setIsBodyTalkGuideModalOpen] =
    useState(false);
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const navigate = useNavigate();
  const userNo = useSelector((state) => state.auth.userNo);
  const maxNo = useSelector((state) => state.room.maxNo);

  const [round, setRound] = useState(1);
  const [keywordType, setKeywordType] = useState(""); //제시어의 분류 : 동물, 악기 등등
  const [receivedKeyword, setReceivedKeyword] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [durationTime, setDurationTime] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [cmdType, setCmdType] = useState("");
  const [isExplainer, setIsExplainer] = useState(false);

  // isBodyTalkWelcomeModalOpen 닫고 isBodyTalkGuideModalOpen 열기

  const sendMessage = () => {
    if (client && client.connected) {
      console.log("보내는 메시지:", {
        senderNum: userNo,
        content: typedText,
      });
      client.send(
        `/app/game/${roomId}/bodyTalk/chat`,
        {},
        JSON.stringify({
          senderNum: userNo,
          content: typedText,
        })
      );
      setTypedText("");
    }
  };
  //최초 1회 실행
  useEffect(() => {
    console.log("--------------------------------");
    console.log("연결 상태 : ", client.connected);
    console.log("--------------------------------");
    console.log("유저 번호 :", userNo);
    if (client && client.connected && !subscribed) {
      //멤버아이디로 구독 - 몸으로 표현하는사람은 이거를 통해 받음
      client.subscribe(`/topic/game/${roomId}/${userNo}`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        console.log("출제자 키워드 :", parsedMessage);

        if (parsedMessage.commandType == "BODYGAME_EXPLANIER") {
          setIsExplainer(true);
          setKeywordType(parsedMessage.data.type);
          console.log(parsedMessage.data.type);
          console.log(keywordType);
          setReceivedKeyword(parsedMessage.data.word);
          console.log(receivedKeyword);
        } else if (
          parsedMessage.commandType == "RESULT" &&
          parsedMessage.data.durationTime
        ) {
          setDurationTime(parsedMessage.data.durationTime);
          console.log("진행 시간 : ", parsedMessage.data.durationTime);
        }
      });

      //방 구독
      client.subscribe(`/topic/game/${roomId}`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        setCmdType(parsedMessage.commandType);
        console.log("키워드 타입 :", parsedMessage);

        if (
          parsedMessage.commandType == "KEYWORD_TYPE" &&
          parsedMessage.data !== "요청 불가"
        ) {
          setKeywordType(parsedMessage.data);
        }
        if (
          parsedMessage.commandType == "CHAT" &&
          parsedMessage.data.correct == true
        ) {
          setKeywordType("");
          setReceivedKeyword("");
          setRound((prev) => prev + 1);
        }
        // setKeywordType

        if (parsedMessage.commandType == "GAME_MODAL_START") {
          setIsBodyTalkGuideModalOpen(false);
          setIsBodyTalkWelcomeModalOpen(false);
          client.send(`/app/game/${roomId}/bodyTalk/keyword`);
        }
        //서버에서 응답 받는데 채팅친게 정답이면 다음 라운드로
        if (parsedMessage.data.isCorrect === true) {
          setRound((prevRound) => prevRound + 1);
        }
      });

      setSubscribed(true);
    }
  }, [client, roomId, userNo, subscribed]);

  //라운드 변경시 실행
  useEffect(() => {
    // 정답을 맞추면 다음 턴으로 이동 ⇒ 키워드 요청 api 호출
    if (client && client.connected && isGameStarted == true) {
      client.send(`/app/game/${roomId}/bodyTalk/keyword`);
    }
  }, [round, client, roomId]);

  const openBodyTalkGuideModal = () => {
    setIsBodyTalkWelcomeModalOpen(false);
    setIsBodyTalkGuideModalOpen(true);
  };

  const closeBodyTalkGuideModal = () => {
    setIsBodyTalkGuideModalOpen(false);
  };

  //이후에 채팅 친 내용 보낼 떄 아래 코드 갖다 사용
  // if (client && client.connected) {
  //   client.send(
  //     `/app/game/${roomId}/bodyTalk/chat`,
  //     {},
  //     JSON.stringify({
  //       senderNum: userNo,
  //       content: typedChat,
  //     })
  //   );
  // }

  return (
    <Wrap>
      {isBodyTalkWelcomeModalOpen && (
        <GameInfoModal
          planetImg={orange}
          RedBtnText={"게임 시작"}
          // {/* 게임시작 버튼 누르면 모달 닫고 페이지에서 진행 */}
          RedBtnFn={closeBodyTalkGuideModal}
          BlueBtnText={"게임 설명"}
          BlueBtnFn={openBodyTalkGuideModal}
          modalText={"몸으로말해요 게임에 오신걸 환영합니다 !"}
          onClose={() => setIsBodyTalkWelcomeModalOpen(false)}
        />
      )}
      {isBodyTalkGuideModalOpen && (
        <GameModal
          RedBtnText={"게임 시작"}
          // {/* 게임시작 버튼 누르면 모달 닫고 페이지에서 진행 */}
          RedBtnFn={() => {
            closeBodyTalkGuideModal();
            if (client && client.connected) {
              client.send(`/app/game/${roomId}/start-modal/BODY_TALK`);
              client.send(`/app/game/${roomId}/bodyTalk/keyword`);
              setIsGameStarted(true);
            }
          }}
          modalText={
            <>
              한 명은 제시어를 몸으로 표현하고, <br /> 나머지는 제시어를 맞추면
              됩니다. <br />
              제한 시간은 4분입니다.
            </>
          }
          onClose={() => {
            setIsBodyTalkGuideModalOpen(false);
          }}
        />
      )}

      {isExplainer ? (
        <ExplainerWrap>
          <SpeechBubble text={receivedKeyword} />
          <img src={bigNana} />
          <div>
            <h1
              style={{ fontSize: "34px", fontWeight: "600", color: "#626262" }}
            >
              주어진 제시어를 몸으로 표현하세요!
            </h1>
            <h4 style={{ fontSize: "26px", color: "#81939C" }}>
              마이크는 꺼집니다
            </h4>
          </div>
        </ExplainerWrap>
      ) : (
        <QuestionerWrap>
          <h1
            style={{
              fontSize: "34px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "#626262",
            }}
          >
            출제자를 보고 답을 맞춰주세요!
          </h1>
          <h4 style={{ fontSize: "26px", color: "#81939C" }}>
            아래 채팅창에 입력해주세요 :)
          </h4>
          <ChatWrap>
            <input
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <button onClick={sendMessage}>보냄</button>
          </ChatWrap>
        </QuestionerWrap>
      )}
      <h1>제시어 종류 : {keywordType}</h1>
      {/* {cmdType == "BODYGAME_EXPLANIER" && <h1>제시어 : {receivedKeyword}</h1>} */}
      <h1>제시어 : {receivedKeyword}</h1>
      <div>라운드 {round}</div>
    </Wrap>
  );
};

export default Game2;

// 종료 키워드 타입 :
// {
//   "message": "SUCCESS",
//   "commandType": "BODYGAME_RESULT",
//   "data": {
//       "durationTime": 24,
//       "correctCnt": 6
//   }
// }
