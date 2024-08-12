import React, { useEffect, useState, useRef } from "react";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import styled from "styled-components";
import orange from "../../assets/icons/orange.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SpeechBubble from "../../components/speechBubble/SpeechBubble";
import bigNana from "../../assets/icons/game2nana.png";
import OpenViduSession from "../../components/OpenViduSession";

const Wrap = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: row;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 100px;
  // margin-right: 190px;
  margin-left: 170px;
  // padding: 0 130px; /* 좌우에 패딩 추가 */
`;

const Header = styled.h1`
  color: #ff007a;
  font-size: 28px;
  // margin-top: 30px;
  // margin-bottom: 100px;
`;

const Header2 = styled.h1`
  color: white;
  font-size: 24px;
  margin-bottom: 20px;
`;

const ChatWrap = styled.div`
  width: 60%;
  position: fixed;
  bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  width: 45%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.3s ease-in-out;

  &:focus {
    border-color: #ff6b6b;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  background-color: #58fff5;
  color: #54595e;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #ff4b4b;
  }
`;

const Image = styled.img`
  max-width: 300px;
  height: auto;
  // margin: 35px 0;
  margin-left: 140px;
  margin-top: 50px;
  margin-bottom: 20px;
`;

const UserVideo = styled.video`
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 6px;
  background-color: black;
  margin: 20px 0;
`;

const VideoWrapper = styled.div`
  width: 75%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Timer = styled.div`
  font-size: 38px;
  color: #58fff5;
  font-weight: bold;
  // background-color: white;
  padding-left: 120px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

// 몸으로 말해요 (BodyTalk)
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
  const localStream = useSelector((state) => state.room.localStream);
  const userVideoRef = useRef(null); // 출제자 영상 - 사용자 비디오 스트림 설정
  const openViduToken = useSelector((state) => state.auth.openViduToken);
  const videoRef = useRef(null);
  const subscribers = useSelector((state) => state.room.subscribers);
  const subscriberVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  // const explainerNo = useSelector((state) => state.bodytalk.explainerNo);

  const [round, setRound] = useState(1);
  const [keywordType, setKeywordType] = useState(""); //제시어의 분류 : 동물, 악기 등등
  const [receivedKeyword, setReceivedKeyword] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [durationTime, setDurationTime] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [cmdType, setCmdType] = useState("");
  const [isExplainer, setIsExplainer] = useState(false);
  const [explainerNo, setExplainerNo] = useState(1); // 출제자의 userNo
  const [timeLeft, setTimeLeft] = useState(240); // 4분 = 240초
  const [isGameEnded, setIsGameEnded] = useState(false); 

  useEffect(() => {
    if (explainerNo === userNo) {
      setIsExplainer(true);
      setExplainerNo(userNo);
    } else {
      setIsExplainer(false);
    }
    console.log("userNo: ", userNo);
    console.log("explainerNo: ", explainerNo);
    console.log("isExplainer:", isExplainer);
  }, [userNo, explainerNo, client, roomId, subscribed]);

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
        console.log(message);

        if (parsedMessage.commandType == "BODYGAME_EXPLANIER") {
          setIsExplainer(true);
          setExplainerNo(userNo);
          console.log("userNo: ", userNo);
          console.log("explainerNo: ", explainerNo);
          setKeywordType(parsedMessage.data.type);
          console.log(parsedMessage.data.type);
          console.log(keywordType);
          setReceivedKeyword(parsedMessage.data.word);
          console.log(parsedMessage.data.word);
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
        // 출제자이면,
        if (parsedMessage.commandType === "BODYGAME_EXPLANIER") {
          setExplainerNo(userNo); // 서버에서 받은 출제자 번호 설정
          setIsExplainer(true); // 현재 사용자가 출제자인지 확인
        }
        if (
          parsedMessage.commandType == "CHAT" &&
          parsedMessage.data.correct == true
        ) {
          setKeywordType("");
          setReceivedKeyword("");
          setRound((prev) => prev + 1);
          setIsExplainer(false);
        }
        if (parsedMessage.commandType == "GAME_MODAL_START") {
          setIsBodyTalkGuideModalOpen(false);
          setIsBodyTalkWelcomeModalOpen(false);
          client.send(`/app/game/${roomId}/bodyTalk/keyword`);
        }
        //서버에서 응답 받는데 채팅친게 정답이면 다음 라운드로
        if (parsedMessage.data.isCorrect === true) {
          setIsExplainer(false);
          setRound((prevRound) => prevRound + 1);
        }
      });

      setSubscribed(true);
    }
  }, [client, roomId, userNo, subscribed, explainerNo]);

  //라운드 변경시 실행
  useEffect(() => {
    // 정답을 맞추면 다음 턴으로 이동 ⇒ 키워드 요청 api 호출
    if (client && client.connected && isGameStarted) {
      // isExplainer 초기화
      // setIsExplainer(false);
      client.send(`/app/game/${roomId}/bodyTalk/keyword`);
    }
    if (round === 7) {
      // 게임 종료 로직
      setIsGameEnded(true);
    }
  }, [round, client, isGameStarted, roomId]);

  useEffect(() => {
    if (localStream && userVideoRef.current && explainerNo === userNo) {
      userVideoRef.current.srcObject = localStream.getMediaStream();
      console.log("로컬 스트림이 비디오 요소에 설정되었습니다.", localStream);
    }
  }, [localStream, explainerNo, userNo]);

  useEffect(() => {
    if (
      subscribers.length > 0 &&
      subscriberVideoRef.current &&
      explainerNo !== userNo
    ) {
      const subscriber = subscribers.find(
        (sub) => sub.stream.connection.data === `{"userNo":${explainerNo}}`
      );
      if (subscriber) {
        subscriberVideoRef.current.srcObject =
          subscriber.stream.getMediaStream();
        console.log(
          "서브스크립션 스트림이 비디오 요소에 설정되었습니다.",
          subscriber.stream
        );
      }
    }
  }, [subscribers, explainerNo, userNo]);

  // 타이머 로직
  useEffect(() => {
    if (!isGameEnded) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
      // } else { // 타이머 끝나면
        // if (isStarted) {
        //   // axios 보낼 로직
        // }
      }
    }
  }, [timeLeft]);

  // 타이머 포맷
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const openBodyTalkGuideModal = () => {
    setIsBodyTalkWelcomeModalOpen(false);
    setIsBodyTalkGuideModalOpen(true);
  };

  const closeBodyTalkGuideModal = () => {
    setIsBodyTalkGuideModalOpen(false);
  };

  return (
    <Wrap>
      {isBodyTalkWelcomeModalOpen && (
        <GameInfoModal
          planetImg={orange}
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

      {/* 모달 끝나고 화면 */}
      {isGameEnded ? (
        <>
          {/* 게임 종료 화면 */}
          <Header2>게임이 종료되었습니다.</Header2>
          <Button onClick={() => {navigate("/icebreaking/games");}}>
            다른 게임들 보러가기
          </Button>
        </>
      ) : isExplainer ? (
          <>
            {/* 출제자 화면 */}
            <HeaderContainer>
              <Header>{round} 라운드 - 출제자</Header>
              <Timer>{formatTime(timeLeft)}</Timer>
            </HeaderContainer>
            <SpeechBubble
              type={
                <>
                  제시어 종류 : {keywordType} <br />
                  <br />
                </>
              }
              word={`제시어 : ${receivedKeyword}`}
            />
            <Image src={bigNana} />
            <Header2>당신은 제시어를 몸으로 표현해야 합니다!</Header2>
            <h1>마이크는 꺼집니다.</h1>
          </>
        ) : (
          <>
            {/* 맞추는 사람 화면 */}
            <HeaderContainer>
              <Header>{round} 라운드 - 맞추는 사람</Header>
              <Timer>{formatTime(timeLeft)}</Timer>
            </HeaderContainer>
            <SpeechBubble type={`현재 제시어 종류 : ${keywordType}`} />
            {/* <h1>출제자 화면 출력</h1> */}
            <VideoWrapper>
              {explainerNo === userNo ? (
                <UserVideo ref={userVideoRef} autoPlay muted />
              ) : (
                <UserVideo ref={subscriberVideoRef} autoPlay muted />
              )}
            </VideoWrapper>
            <Header2>출제자 화면을 보고 제시어를 맞춰보세요 !</Header2>
            <ChatWrap>
              <Input
                type="text"
                value={typedText}
                placeholder="여기에 정답을 입력하세요."
                onChange={(e) => setTypedText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              <Button onClick={sendMessage}>SEND</Button>
            </ChatWrap>
          </>
      )}
    </Wrap>
  );
};

export default Game2;
