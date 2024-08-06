import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import IntroductionGuideModal from "../../components/modals/IntroductionGuideModal";
import IntroductionModal from "../../components/modals/IntroductionModal";
import DrawingModal from "../../components/modals/DrawingModal"; // DrawingModal import 추가
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
  flex-direction: column;
  text-align: center;
`;

// 자기소개 문답 모달 & 이어그리기 페이지 (Drawing)
const Game1 = ({ roomId }) => {
  const [isIntroGuideModalOpen, setIsIntroGuideModalOpen] = useState(true); // IntroductionWelcomeModal 상태
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false); // IntroductionModal 상태
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false); // DrawingModal 상태
  const [memberId, setMemberId] = useState(""); // 현재 사용자 ID 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [statusMessage, setStatusMessage] = useState(""); // 상태 메시지 상태
  const [messages, setMessages] = useState([]); // 메시지 배열 상태
  const [stompClient, setStompClient] = useState(null); // STOMP 클라이언트 상태

  // 웹소켓 연결 설정
  useEffect(() => {
    const socket = new SockJS(`${BASE_URL}/ws`); // SockJS 객체 생성
    const client = Stomp.over(socket); // STOMP 클라이언트 객체 생성

    // 웹소켓 서버에 연결
    client.connect(
      {},
      (frame) => {
        setStatusMessage("웹소켓 서버와 연결됨!");

        // 특정 경로 구독하여 메시지 수신
        client.subscribe(`/topic/game/${roomId}`, (message) => {
          console.log("받은 메시지:", message.body);
          setMessages((prevMessages) => [...prevMessages, message.body]); // 받은 메시지를 상태에 추가
        });

        // 세션 정보 구독하여 memberId 저장
        client.subscribe(`/user/queue/session`, (message) => {
          const sessionInfo = JSON.parse(message.body);
          setMemberId(sessionInfo.memberId);
          localStorage.setItem("memberId", sessionInfo.memberId); // memberId를 로컬 스토리지에 저장
        });

        setStompClient(client); // STOMP 클라이언트 객체를 상태로 저장
      },
      (error) => {
        setStatusMessage("웹소켓 서버와 연결 끊김!");
        console.error("STOMP error:", error);
      }
    );

    // 컴포넌트 언마운트 시 또는 roomId 변경 시 실행되는 정리 작업
    return () => {
      if (client) {
        client.disconnect(() => {
          setStatusMessage("웹소켓 서버와 연결 끊김!");
        });
      }
    };
  }, [roomId]);

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
      {statusMessage && <div>{statusMessage}</div>} {/* 상태 메시지 표시 */}
      {isIntroGuideModalOpen && (
        <IntroductionGuideModal
          onClose={closeIntroGuideModal}
          onConfirm={openIntroModal}
        />
      )}
      {isIntroModalOpen &&
        memberId && ( // memberId가 설정된 후 모달 열기
          <IntroductionModal
            onClose={openDrawingModal}
            onConfirm={() => setIsDrawingModalOpen(true)} // IntroductionModal에서 DrawingModal 열기
            roomId={roomId}
            memberId={memberId}
          />
        )}
      {isDrawingModalOpen && (
        <DrawingModal onClose={() => setIsDrawingModalOpen(false)} /> // DrawingModal 컴포넌트 추가
      )}
      <div>
        <SpeechBubble text={"별명 스타일 정해."} />
        <img src={bigNana} style={{ marginLeft: "200px" }} />
        <BoxWrap>
          <BigAquaBtn text={"중세"} />
          <BigAquaBtn text={"조선"} />
          <BigAquaBtn text={"동물"} />
          <BigAquaBtn text={"미래"} />
        </BoxWrap>
      </div>
    </Wrap>
  );
};

export default Game1;
// 살려
