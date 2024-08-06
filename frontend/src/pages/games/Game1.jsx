import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import IntroductionGuideModal from "../../components/modals/IntroductionGuideModal";
import IntroductionModal from "../../components/modals/IntroductionModal";
import blue from "../../assets/icons/blue.png";
// import CanvasDraw from "react-canvas-draw"; // 기존 코드
import { ReactSketchCanvas } from "react-sketch-canvas";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import BASE_URL from "../../api/APIconfig";

const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Header = styled.div`
  width: 90%;
  padding: 10px;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;

const HeaderText = styled.h1`
  margin: 7px;
  color: black;
  font-size: 27px;
`;

const CanvasWrapper = styled.div`
  position: relative;
  width: 90%;
  height: 600px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ToolsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: #f0f0f0;
  border-top: 1px solid #ccc;
`;

const ToolButton = styled.button`
  background-color: ${(props) => (props.active ? "#58fff5" : "#ccc")};
  font-size: 19px;
  font-weight: bold;
  color: black;
  width: 100px;
  height: 50px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin: 0 5px;
`;

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
`;

const SliderLabel = styled.label`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
  color: black;
`;

const Slider = styled.input`
  width: 100px;
`;

const Timer = styled.div`
  width: 180px;
  height: 50px;
  font-size: 32px;
  font-weight: bold;
  color: white;
  background: gray;
  padding: 5px;
  border-radius: 5px;
  margin: 0 20px 0 190px;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  color: black;
  font-size: 24px;
  font-weight: bold;
  flex-direction: row;
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  margin-right: 10px;
`;

const ProfileDetails = styled.div`
  text-align: left;
`;

const CustomSwatchesPicker = styled.div`
  display: grid;
  grid-template-columns: repeat(11, 24px);
  grid-gap: 4px;
  margin: 10px 20px;
`;

const ColorSquare = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${(props) => props.color};
  cursor: pointer;
  border: ${(props) => (props.selected ? "2px solid #000" : "none")};
`;

// 자기소개 문답 모달 & 이어그리기 페이지 (Drawing)
const Game1 = ({ roomId }) => {
  const [isIntroGuideModalOpen, setIsIntroGuideModalOpen] = useState(true); // IntroductionWelcomeModal 상태
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false); // IntroductionModal 상태
  const [isDrawingWelcomeModalOpen, setIsDrawingWelcomeModalOpen] =
    useState(false); // DrawingWelcomeModal 상태
  const [isDrawingGuideModalOpen, setIsDrawingGuideModalOpen] = useState(false); // DrawingGuideModal 상태
  const [brushColor, setBrushColor] = useState("#000000"); // 브러시 색상 상태
  const [brushRadius, setBrushRadius] = useState(5); // 브러시 크기 상태
  const [isEraser, setIsEraser] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [memberId, setMemberId] = useState(""); // 현재 사용자 ID 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  // const [statusMessage, setStatusMessage] = useState(''); // 상태 메시지 상태
  // const [messages, setMessages] = useState([]); // 메시지 배열 상태
  // const [stompClient, setStompClient] = useState(null); // STOMP 클라이언트 상태

  // 웹소켓 연결 설정
  // useEffect(() => {
  //   const socket = new SockJS(`${BASE_URL}/ws`); // SockJS 객체 생성
  //   const client = Stomp.over(socket); // STOMP 클라이언트 객체 생성

  //   // 웹소켓 서버에 연결
  //   client.connect({}, (frame) => {
  //     setStatusMessage('웹소켓 서버와 연결됨!');

  //     // 특정 경로 구독하여 메시지 수신
  //     client.subscribe(`/topic/game/${roomId}`, (message) => {
  //       console.log('받은 메시지:', message.body);
  //       setMessages((prevMessages) => [...prevMessages, message.body]); // 받은 메시지를 상태에 추가
  //     });

  //     // 세션 정보 구독하여 memberId 저장
  //     client.subscribe(`/user/queue/session`, (message) => {
  //       const sessionInfo = JSON.parse(message.body);
  //       setMemberId(sessionInfo.memberId);
  //       localStorage.setItem('memberId', sessionInfo.memberId); // memberId를 로컬 스토리지에 저장
  //     });

  //     setStompClient(client); // STOMP 클라이언트 객체를 상태로 저장
  //   }, (error) => {
  //     setStatusMessage('웹소켓 서버와 연결 끊김!');
  //     console.error('STOMP error:', error);
  //   });

  //   // 컴포넌트 언마운트 시 또는 roomId 변경 시 실행되는 정리 작업
  //   return () => {
  //     if (client) {
  //       client.disconnect(() => {
  //         setStatusMessage('웹소켓 서버와 연결 끊김!');
  //       });
  //     }
  //   };
  // }, [roomId]);

  // IntroductionGuideModal 닫고 IntroductionModal 열기
  const openIntroModal = () => {
    setIsIntroGuideModalOpen(false);
    setIsIntroModalOpen(true);
  };

  // IntroductionGuideModal 닫기
  const closeIntroGuideModal = () => {
    setIsIntroGuideModalOpen(false);
  };

  // IntroductionModal 닫기
  const closeIntroModal = () => {
    setIsIntroModalOpen(false);
  };

  // IntroductionModal 닫고 DrawingWelcomeModal 열기
  const openDrawingWelcomeModal = () => {
    setIsIntroModalOpen(false);
    setIsDrawingWelcomeModalOpen(true);
  };

  // DrawingWelcomeModal 닫기
  const closeDrawingWelcomeModal = () => {
    setIsDrawingWelcomeModalOpen(false);
  };

  // DrawingGuideModal 닫기
  const closeDrawingGuideModal = () => {
    setIsDrawingGuideModalOpen(false);
  };

  // DrawingWelcomeModal 닫고 DrawingGuideModal 열기
  const openDrawingGuideModal = () => {
    setIsDrawingWelcomeModalOpen(false);
    setIsDrawingGuideModalOpen(true);
  };

  const handleColorChange = (color) => {
    setBrushColor(color);
    setIsEraser(false);
  };

  useEffect(() => {
    if (
      !isIntroGuideModalOpen &&
      !isIntroModalOpen &&
      !isDrawingWelcomeModalOpen &&
      !isDrawingGuideModalOpen
    ) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [
    timeLeft,
    isIntroGuideModalOpen,
    isIntroModalOpen,
    isDrawingWelcomeModalOpen,
    isDrawingGuideModalOpen,
  ]);

  const colors = [
    "#FF0000",
    "#FF7F00",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#4B0082",
    "#8B00FF",
    "#000000",
    "#FFFFFF",
    "#A52A2A",
    "#D2691E",
    "#DAA520",
    "#808000",
    "#008000",
    "#008080",
    "#00FFFF",
    "#4682B4",
    "#00008B",
    "#8A2BE2",
    "#FF1493",
    "#D3D3D3",
    "#A9A9A9",
  ];

  return (
    <Wrap>
      {error && <div style={{ color: "red" }}>{error}</div>}{" "}
      {/* 에러 메시지 표시 */}
      {/* {statusMessage && <div>{statusMessage}</div>} 상태 메시지 표시 */}
      {isIntroGuideModalOpen && (
        <IntroductionGuideModal
          onClose={closeIntroGuideModal}
          onConfirm={openIntroModal}
        />
      )}
      {isIntroModalOpen && (
        <IntroductionModal onClose={openDrawingWelcomeModal} />
      )}
      {/* {isIntroModalOpen && memberId && ( // memberId가 설정된 후 모달 열기
        <IntroductionModal
        onClose={openDrawingWelcomeModal}
        onConfirm={() => setIsDrawingWelcomeModalOpen(true)} // IntroductionModal에서 DrawingWelcomeModal 열기
        roomId={roomId}
        memberId={memberId}
        />
        )} */}
      {/* 이어그리기 행성 입장 */}
      {isDrawingWelcomeModalOpen && (
        <GameInfoModal
          planetImg={blue}
          RedBtnText={"게임 시작"}
          // {/* 게임시작 버튼 누르면 모달 닫고 페이지에서 진행 */}
          RedBtnFn={closeDrawingWelcomeModal}
          BlueBtnText={"게임 설명"}
          BlueBtnFn={openDrawingGuideModal}
          modalText={"이어그리기 게임에 오신걸 환영합니다 !"}
          onClose={closeDrawingWelcomeModal}
        />
      )}
      {isDrawingGuideModalOpen && (
        <GameModal
          RedBtnText={"게임 시작"}
          // {/* 게임시작 버튼 누르면 모달 닫고 페이지에서 진행 */}
          RedBtnFn={closeDrawingGuideModal}
          modalText={
            <>
              주어지는 이미지와 특징을 바탕으로 <br /> 아바타를 그려주세요.{" "}
              <br />
              제한시간은 20초입니다.
            </>
          }
          onClose={closeDrawingGuideModal}
        />
      )}
      {/* 이어그리기 화면 (캔버스) */}
      {!isIntroGuideModalOpen &&
        !isIntroModalOpen &&
        !isDrawingWelcomeModalOpen &&
        !isDrawingGuideModalOpen && (
          <>
            <Header>
              <ProfileInfo>
                <ProfileImage
                  src="path/to/profile-image.png"
                  alt="프로필 이미지"
                />
                <ProfileDetails>
                  <HeaderText>이름: 홍길동</HeaderText>
                  <HeaderText>키워드: #뾰족코 #근엄한</HeaderText>
                </ProfileDetails>
              </ProfileInfo>
              <HeaderText>
                주어진 정보를 활용하여 아바타를 그려주세요!
              </HeaderText>
            </Header>
            <CanvasWrapper>
              <ReactSketchCanvas
                style={{ border: "1px solid #000" }}
                width="900"
                height="600"
                strokeWidth={brushRadius}
                strokeColor={isEraser ? "#FFFFFF" : brushColor}
              />
              <ToolsWrapper>
                <CustomSwatchesPicker>
                  {colors.map((color) => (
                    <ColorSquare
                      key={color}
                      color={color}
                      selected={brushColor === color}
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </CustomSwatchesPicker>
                <SliderWrapper>
                  <SliderLabel>펜 굵기</SliderLabel>
                  <Slider
                    type="range"
                    min="1"
                    max="20"
                    value={brushRadius}
                    onChange={(e) => setBrushRadius(e.target.value)}
                  />
                </SliderWrapper>
                <ToolButton onClick={() => setIsEraser(!isEraser)}>
                  {isEraser ? "펜" : "지우개"}
                </ToolButton>
                <Timer>{timeLeft}</Timer>
              </ToolsWrapper>
            </CanvasWrapper>
          </>
        )}
    </Wrap>
  );
};

export default Game1;
// 살려
