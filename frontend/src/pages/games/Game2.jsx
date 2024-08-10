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
  color: #FF007A;
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
  background-color: #58FFF5;
  color: #54595E;
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
  color: #58FFF5;
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
  const openViduToken = useSelector((state) => state.auth.openViduToken);
  const videoRef = useRef(null);
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
  const [explainerNo, setExplainerNo] = useState(1);
  const [timeLeft, setTimeLeft] = useState(240); // 4분 = 240초

  
  // 출제자 영상
  // 사용자 비디오 스트림 설정
  const userVideoRef = useRef(null);

  useEffect(() => {
    if (localStream && userVideoRef.current) {
      userVideoRef.current.srcObject = localStream.getMediaStream();
      console.log("로컬 스트림이 비디오 요소에 설정되었습니다.", localStream);
    }
  }, [localStream]);

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
          setExplainerNo(userNo);
          console.log('userNo: ', userNo);
          console.log('explainerNo: ', explainerNo);
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
        } else {
          console.log('userNo: ', userNo);
          console.log('explainerNo: ', explainerNo);
        }
        if (
          parsedMessage.commandType == "CHAT" &&
          parsedMessage.data.correct == true
        ) {
          setKeywordType("");
          setReceivedKeyword("");
          setRound((prev) => prev + 1);
        }

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
      // isExplainer 초기화
      setIsExplainer(false);
      client.send(`/app/game/${roomId}/bodyTalk/keyword`);
    }
  }, [round, client, roomId]);
  
  // 타이머 로직
  useEffect(() => {
    if (isGameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer); // cleanup
    } else if (timeLeft === 0) {
      // 타이머가 0이 되면 게임 종료 로직 추가 가능
      console.log("시간 종료");
    }
  }, [isGameStarted, timeLeft]);

  // 타이머 포맷
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
      {isExplainer ? (
        <>
          <HeaderContainer>
            <Header>{round} 라운드 - 출제자</Header>
            <Timer>{formatTime(timeLeft)}</Timer> {/* 타이머 표시 */}
          </HeaderContainer>
          <SpeechBubble
            type={
              <>
                제시어 종류 : {keywordType} <br /><br />
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
          <HeaderContainer>
            <Header>{round} 라운드 - 맞추는 사람</Header>
            <Timer>{formatTime(timeLeft)}</Timer> {/* 타이머 표시 */}
          </HeaderContainer>
          <SpeechBubble
            type={`현재 제시어 종류 : ${keywordType}`}
          />
          {/* <h1>출제자 화면 출력</h1> */}
          <VideoWrapper>
            {explainerNo === userNo && (
              <UserVideo ref={userVideoRef} autoPlay muted />
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
