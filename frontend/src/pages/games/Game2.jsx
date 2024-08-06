import React, { useEffect, useState } from "react";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import styled from "styled-components";
import orange from "../../assets/icons/orange.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

  // isBodyTalkWelcomeModalOpen 닫고 isBodyTalkGuideModalOpen 열기

  //최초 1회 실행
  useEffect(() => {
    console.log("--------------------------------");
    console.log("연결 상태 : ", client.connected);
    console.log("--------------------------------");
    if (client && client.connected) {
      //멤버아이디로 구독 - 몸으로 표현하는사람은 이거를 통해 받음
      client.subscribe(`/topic/game/${roomId}/${userNo}`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        console.log("출제자 키워드 :", parsedMessage.data);
        setReceivedKeyword(parsedMessage.data.word);

        // {
        //   "message" : "SUCCESS",
        //   "data" : {
        //         "type" : "동물",
        //         "word" : "악어"
        //     },
        //   "commandType" : "EXPLANIER"
        // }

        // 결과
        if (
          parsedMessage.commandType == "RESULT" &&
          parsedMessage.data.durationTime
        ) {
          setDurationTime(parsedMessage.data.durationTime);
          console.log("진행 시간 : ", parsedMessage.data.durationTime);
        }
        // {
        //   "message" : "SUCCESS",
        //   "commandType" : "RESULT",
        //   "data" : {
        //     "correctCnt" : 5,  // 맞은 갯수
        //     "durationTime" : 80  // 게임 종료까지 걸린 시간(초)
        //   }
        // }
      });

      //방 구독
      client.subscribe(`/topic/game/${roomId}`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        console.log("키워드 타입 :", parsedMessage.data);
        setKeywordType(parsedMessage.data);
        // {

        //   "message" : "SUCCESS",
        //   "CommandType" : "KEYWORD_TYPE",
        //   "data" : "동물"
        // }

        //서버에서 응답 받는데 채팅친게 정답이면 다음 라운드로
        if (parsedMessage.data.isCorrect == true) {
          setRound((prevRound) => prevRound + 1);
        }
      });
    }
  }, []);

  //라운드 변경시 실행
  useEffect(() => {
    // 정답을 맞추면 다음 턴으로 이동 ⇒ 키워드 요청 api 호출
    if (client && client.connected) {
      client.send(`/app/game/${roomId}/bodyTalk/keyword`);
    }
  }, [round]);

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
      몸으로 말해요 게임 화면
    </Wrap>
  );
};

export default Game2;
