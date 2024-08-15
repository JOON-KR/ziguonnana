import React, { useEffect, useState, useRef } from "react";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import styled from "styled-components";
import orange from "../../assets/icons/orange.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SpeechBubble from "../../components/speechBubble/SpeechBubble";
import bigNana from "../../assets/icons/game2nana.png";
import OpenViduSession from "../../components/OpenViduSession";
import { setGame2Finish } from "../../store/resultSlice";
import { log } from "@tensorflow/tfjs";
import btnIcon from "../../assets/icons/aqua_btn.png";
import homeIcon from "../../assets/icons/home.png"; 

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100vh; /* 뷰포트 높이에 맞추기 */
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
`;

const Header = styled.h1`
  color: #ffffff;
  text-decoration-line: underline;
  text-decoration-thickness: 5px;
  text-decoration-color: #58fff5;
  font-size: 40px;
`;

const Header2 = styled.h1`
  color: white;
  font-size: 2vw;
  margin-top: 10px;
  margin-bottom: 10px;
  line-height: 1.2;
  text-align: center;
`;

const BubbleWrap = styled.div`
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChatWrap = styled.div`
  width: 100%;
  position: fixed;
  bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
`;

const Input = styled.input`
  width: 30%;
  padding: 10px;
  font-size: 1.2vw;
  border: 2px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.3s ease-in-out;
  margin-bottom: 20px;

  &:focus {
    border-color: #ff6b6b;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1.2vw;
  font-weight: bold;
  background-color: #58fff5;
  color: #54595e;
  border: none;
  border-radius: 5px;
  margin-bottom: 20px;

  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #ff4b4b;
  }
`;

const ButtonContainer = styled.div`
  position: relative;
  margin-top: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
`;

const ButtonText = styled.p`
  position: absolute;
  top: 28%;
  left: 25%;
  color: white;
  font-size: 1.5vw;
  font-weight: bold;
  pointer-events: none;
`;

const IconImage = styled.img`
  width: 10vw;
`;

const UserVideo = styled.video`
  width: 80%;
  max-width: 600px;
  height: auto;
  border-radius: 6px;
  background-color: black;
  margin-top: 40px;
  margin-bottom: 40px;
`;

const VideoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const Timer = styled.div`
  font-size: 2.5vw;
  color: #ff4545;
  font-weight: bold;
  text-align: center;
`;

const HomeIcon = styled.img`
  position: absolute;
  top:10px;
  right: 20px;
  width: 30px;
  height: 30px;
  cursor: pointer;
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

  const [round, setRound] = useState(0);
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
  const [resultData, setResultData] = useState(null); // 결과 데이터 저장
  const dispatch = useDispatch();
  const [isEnded, setIsEnded] = useState(false);

  const [targetUser, setTargetUser] = useState(0);

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

  useEffect(() => {
    if (explainerNo === userNo) {
      setIsExplainer(true);
      console.log(
        "출제자 설정: userNo = ",
        userNo,
        "explainerNo = ",
        explainerNo
      );
    } else {
      setIsExplainer(false);
      console.log(
        "맞추는 사람 설정: userNo = ",
        userNo,
        "explainerNo = ",
        explainerNo
      );
    }
  }, [userNo, explainerNo]);

  // isExplainer 상태가 변경된 이후에 로그를 찍는 훅
  useEffect(() => {
    console.log("isExplainer 상태 변경됨: ", isExplainer);
  }, [isExplainer]);

  useEffect(() => {
    if (explainerNo === userNo) {
      setIsExplainer(true);
      setExplainerNo(userNo);
    } else {
      setIsExplainer(false);
    }

    console.log("--------------------------------");
    console.log("연결 상태 : ", client.connected);
    console.log("--------------------------------");
    console.log("초기 라운드 : ", round);
    console.log("userNo: ", userNo);
    console.log("explainerNo: ", explainerNo);

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
          setKeywordType(parsedMessage.data.keywordType);
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
          dispatch(setGame2Finish());
          setIsEnded(true);

          setTimeout(() => {
            navigate("/games");
          }, 3000);
        }
      });

      //방 구독
      client.subscribe(`/topic/game/${roomId}`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        setCmdType(parsedMessage.commandType);
        console.log("키워드 타입 :", parsedMessage);

        if (
          parsedMessage.commandType == "KEYWORD_TYPE" &&
          parsedMessage.data.keywordType !== "요청 불가"
        ) {
          setKeywordType(parsedMessage.data.keywordType);
          setExplainerNo(parsedMessage.data.explanierNum);
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
          setRound(parsedMessage.data.round);
          console.log("서버에서 받은 라운드:" + parsedMessage.data.round);
          setIsExplainer(false);
        }
        if (parsedMessage.commandType == "GAME_MODAL_START") {
          setIsBodyTalkGuideModalOpen(false);
          setIsBodyTalkWelcomeModalOpen(false);
          client.send(`/app/game/${roomId}/bodyTalk/keyword`);
        }
        // //서버에서 응답 받는데 채팅친게 정답이면 다음 라운드로
        // if (parsedMessage.data.isCorrect === true) {
        //   setIsExplainer(false);
        //   setRound(parsedMessage.data.round);
        // }

        // 서버에서 결과가 도착하면 처리
        if (parsedMessage.commandType === "BODYGAME_RESULT") {
          setResultData(parsedMessage.data);
          navigate("/icebreaking/games/game2result", {
            state: {
              correctCnt: parsedMessage.data.correctCnt,
              durationTime: parsedMessage.data.durationTime,
            },
          });
        }
      });
      setSubscribed(true);
    }
  }, [client, roomId, userNo, subscribed, explainerNo]);

  //라운드가 변경될 때 마다 실행됨. 게임의 상태가 변경될때 필요한 작업 처리
  useEffect(() => {
    // 정답을 맞추면 다음 턴으로 이동 ⇒ 키워드 요청 api 호출
    if (client && client.connected && isGameStarted) {
      // isExplainer 초기화
      // setIsExplainer(false);
      client.send(`/app/game/${roomId}/bodyTalk/keyword`);
      console.log("키워드 요청요청요청");
    }
    if (round === 3) {
      // 게임 종료 로직
      setIsGameEnded(true);
    } else {
      // 새로운 라운드로 출제자 초기화
      setIsExplainer(false);
    }
  }, [round, client, isGameStarted, roomId]);

  //로컬 스트림 설정
  // 로컬 스트림 설정
  useEffect(() => {
    if (explainerNo === userNo) {
      // 출제자인 경우
      if (localStream && userVideoRef.current) {
        userVideoRef.current.srcObject = localStream.getMediaStream();
        console.log("로컬 스트림이 비디오 요소에 설정되었습니다.", localStream);
      } else if (!localStream) {
        console.log("로컬 스트림이 아직 준비되지 않았습니다.");
      }
    }
  }, [localStream, explainerNo, userNo]);
  // useEffect(() => {
  //   if (localStream && userVideoRef.current && explainerNo === userNo) {
  //     userVideoRef.current.srcObject = localStream.getMediaStream();
  //     console.log("로컬 스트림이 비디오 요소에 설정되었습니다.", localStream);
  //   } else if (explainerNo === userNo && !localStream) {
  //     console.log("로컬 스트림이 없으나 출제자입니다.");
  //     userVideoRef.current.srcObject = null; // 스트림이 없을 경우 비디오 요소를 비웁니다.
  //   }
  // }, [localStream, explainerNo, userNo]);

  //서브 스트림
  useEffect(() => {
    if (
      subscribers.length > 0 &&
      subscriberVideoRef.current &&
      explainerNo !== userNo
    ) {
      const subscriber = subscribers.find(
        (sub) => JSON.parse(sub.stream.connection.data).userNo === explainerNo
      );
      if (subscriber) {
        subscriberVideoRef.current.srcObject =
          subscriber.stream.getMediaStream();
        console.log(
          "서브스크립션 스트림이 비디오 요소에 설정되었습니다.",
          subscriber.stream
        );
      } else {
        console.log("적절한 구독자를 찾을 수 없습니다.");
        subscriberVideoRef.current.srcObject = null;
      }
    } else if (explainerNo !== userNo && subscribers.length === 0) {
      console.log("구독자 스트림이 없거나 찾을 수 없습니다.");
      subscriberVideoRef.current.srcObject = null;
    }
  }, [subscribers, explainerNo, userNo]);

  // 타이머 로직
  useEffect(() => {
    if (!isGameEnded && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      if (client && client.connected) {
        client.send(`/app/game/${roomId}/bodyTalk/timeover`, {}, {});
      }
    }
  }, [timeLeft, client, roomId, isGameEnded]);

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

  //맵으로 이동
  useEffect(() => {
    if (client && client.connected) {
      const subscription = client.subscribe(
        `/topic/game/${roomId}`,
        (message) => {
          const parsedMessages = JSON.parse(message.body);

          if (parsedMessages.commandType === "NANA_MAP") {
            navigate("/icebreaking/games");
          }
        }
      );
      client.send(`/app/game/${roomId}/art-start`);
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [client, roomId, navigate, dispatch]);


  return (
    <Wrap>
        <HomeIcon src={homeIcon} alt="Home" onClick={() => {
            client.send(`/app/game/${roomId}/game-select`);
          }}
        />
      {/* 환영 모달 */}
      {isBodyTalkWelcomeModalOpen && (
        <GameInfoModal
          planetImg={orange}
          BlueBtnText={"게임 설명"}
          BlueBtnFn={openBodyTalkGuideModal}
          modalText={"몸으로말해요에 오신걸 환영합니다 !"}
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
              한 명은 제시어를{" "}
              <span style={{ color: "#58FFF5" }}>몸으로 표현</span>하고, <br />{" "}
              나머지는 제시어를{" "}
              <span style={{ color: "#58FFF5" }}>맞추면 </span>
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
          <ButtonContainer
            onClick={() => {
              client.send(`/app/game/${roomId}/game-select`);
            }}
          >
            <ButtonText>게임 더보기</ButtonText>
            <IconImage src={btnIcon} alt="gamesBtn" />
          </ButtonContainer>
        </>
      ) : isExplainer ? (
        <>
          {/* 출제자 화면 */}
          <HeaderContainer>
            <Header>{round + 1} 라운드 출제자</Header>
            <Timer>{formatTime(timeLeft)}</Timer>
          </HeaderContainer>
          <Header2>제시어를 몸으로 표현해주세요! 마이크는 꺼집니다. <br />
          제시어는 <span style={{ color: "#58FFF5" }}>{receivedKeyword} </span> 입니다.
          </Header2>
          <VideoWrapper>
            {explainerNo === userNo ? (
              <UserVideo ref={userVideoRef} autoPlay muted />
            ) : (
              <UserVideo ref={subscriberVideoRef} autoPlay muted />
            )}
          </VideoWrapper>
        </>
      ) : (
        <>
          {/* 맞추는 사람 화면 */}
          <HeaderContainer>
            <Header>{round + 1} 라운드</Header>
            <Timer>{formatTime(timeLeft)}</Timer>

            {isEnded && (
              <h1 style={{ fontSize: "50px" }}>
                게임 종료, 3초 뒤 이동합니다.{" "}
              </h1>
            )}
          </HeaderContainer>
          <Header2>
            화면을 보고 제시어를 맞춰보세요 ! <br />
            현재 제시어 종류는{" "}
            <span style={{ color: "#58FFF5" }}>{keywordType} </span> 입니다.
          </Header2>
          {/* <SpeechBubble type={`현재 제시어 종류 : ${keywordType}`} /> */}
          {/* <h1>출제자 화면 출력</h1> */}
          <VideoWrapper>
            {explainerNo === userNo ? (
              <UserVideo ref={userVideoRef} autoPlay muted />
            ) : (
              <UserVideo ref={subscriberVideoRef} autoPlay muted />
            )}
          </VideoWrapper>

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
            <Button onClick={sendMessage}>Enter</Button>
          </ChatWrap>
        </>
      )}
      {/* 임시버튼
      <button
        onClick={() => {
          dispatch(setGame2Finish());
          navigate("/icebreaking/games");
        }}
      >
        결과 스킵
      </button> */}
    </Wrap>
  );
};

export default Game2;
