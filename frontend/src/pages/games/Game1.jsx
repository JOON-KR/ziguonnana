import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import IntroductionGuideModal from "../../components/modals/IntroductionGuideModal";
import IntroductionModal from "../../components/modals/IntroductionModal";
import blue from "../../assets/icons/blue.png";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import BASE_URL from "../../api/APIconfig";
import { useSelector } from "react-redux";
import Game1Drawing from "./Game1Drawing";

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
  width: 120px;
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
  width: 200px;
  height: 50px;
  font-size: 32px;
  font-weight: bold;
  color: white;
  background: #ccc;
  padding: 5px;
  border-radius: 5px;
  margin: 0 20px 0 100px;
  display: flex;
  justify-content: center;
  align-items: center;
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

const Game1 = () => {
  const [isIntroGuideModalOpen, setIsIntroGuideModalOpen] = useState(true); // IntroductionWelcomeModal 상태
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false); // IntroductionModal 상태
  const [isDrawingWelcomeModalOpen, setIsDrawingWelcomeModalOpen] =
    useState(false); // DrawingWelcomeModal 상태
  const [isDrawingGuideModalOpen, setIsDrawingGuideModalOpen] = useState(false); // DrawingGuideModal 상태
  const [brushColor, setBrushColor] = useState("#000000"); // 브러시 색상 상태
  const [brushRadius, setBrushRadius] = useState(5); // 브러시 크기 상태
  const [isEraser, setIsEraser] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5); // 타이머 시간
  const [drawingHistory, setDrawingHistory] = useState([]); // 그린 과정 저장
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const [memberId, setMemberId] = useState(""); // 현재 사용자 ID 상태
  const [members, setMembers] = useState([
    "member1",
    "member2",
    "member3",
    "member4",
    "member5",
    "member6",
  ]); // 멤버 리스트
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0); // 현재 멤버 인덱스 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const navigate = useNavigate();
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);

  useEffect(() => {
    console.log("--------------------------------");
    console.log("연결 상태 : ", client.connected);
    console.log("--------------------------------");
    if (client && client.connected) {
      client.subscribe(`/topic/game/${roomId}`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        // console.log("게임 종류 선택 메시지:", parsedMessage);

        const cmd = parsedMessage.commandType;
        const data = parsedMessage.data;

        console.log("닫기 요청 데이터 ", parsedMessage);
        console.log("닫기 요청 데이터 ", data);

        if (data == "SAME_POSE") {
          setIsDrawingWelcomeModalOpen(false);
          setIsDrawingGuideModalOpen(false);
        } else if (cmd == "GAME_MODAL_START") {
          // setIsIntroGuideModalOpen(false);
          openIntroModal();
        }
      });
    }
  }, [client, roomId]);

  const openIntroModal = () => {
    console.log("Opening Introduction Modal");
    setIsIntroGuideModalOpen(false);
    setIsIntroModalOpen(true);
  };

  const closeIntroGuideModal = () => {
    console.log("Closing Introduction Guide Modal");
    setIsIntroGuideModalOpen(false);
  };

  const closeIntroModal = () => {
    console.log("Closing Introduction Modal");
    setIsIntroModalOpen(false);
    setIsDrawingWelcomeModalOpen(true); // 자기소개 종료 후 DrawingWelcomeModal 열기
  };

  const openDrawingWelcomeModal = () => {
    console.log("Opening Drawing Welcome Modal");
    setIsIntroModalOpen(false);
    setIsDrawingWelcomeModalOpen(true);
  };

  const closeDrawingWelcomeModal = () => {
    console.log("Closing Drawing Welcome Modal");
    setIsDrawingWelcomeModalOpen(false);
  };

  const closeDrawingGuideModal = () => {
    console.log("Closing Drawing Guide Modal");
    setIsDrawingGuideModalOpen(false);
  };

  const openDrawingGuideModal = () => {
    console.log("Opening Drawing Guide Modal");
    setIsDrawingWelcomeModalOpen(false);
    setIsDrawingGuideModalOpen(true);
  };

  const handleColorChange = (color) => {
    console.log("Changing color to:", color);
    setBrushColor(color);
    setIsEraser(false);
  };

  const startReplay = () => {
    console.log("Starting replay");
    setIsReplaying(true);
    setReplayIndex(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const switchToNextMember = () => {
    console.log("Switching to next member");
    setCurrentMemberIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex === 5) {
        // 5명이 그리기를 완료한 후
        startReplay();
      }
      return nextIndex;
    });
    setTimeLeft(5); // 타이머 초기화
  };

  // useEffect(() => {
  //   if (
  //     !isIntroGuideModalOpen &&
  //     !isIntroModalOpen &&
  //     !isDrawingWelcomeModalOpen &&
  //     !isDrawingGuideModalOpen
  //   ) {
  //     if (timeLeft > 0 && !isReplaying) {
  //       const timer = setTimeout(() => {
  //         console.log("Timer countdown:", timeLeft);
  //         setTimeLeft(timeLeft - 1);
  //       }, 1000);
  //       return () => clearTimeout(timer);
  //     } else if (!isReplaying) {
  //       switchToNextMember();
  //     }
  //   }
  // }, [
  //   timeLeft,
  //   isIntroGuideModalOpen,
  //   isIntroModalOpen,
  //   isDrawingWelcomeModalOpen,
  //   isDrawingGuideModalOpen,
  //   isReplaying,
  // ]);

  const replayDrawing = () => {
    if (replayIndex < drawingHistory.length) {
      console.log("Replaying drawing at index:", replayIndex);
      canvasRef.current.clearCanvas();
      canvasRef.current.loadPaths(drawingHistory[replayIndex].paths);
      setReplayIndex(replayIndex + 1);
      animationFrameRef.current = setTimeout(replayDrawing, 500);
    }
  };

  useEffect(() => {
    if (isReplaying) {
      animationFrameRef.current = setTimeout(replayDrawing, 500);
    }
    return () => clearTimeout(animationFrameRef.current);
  }, [isReplaying, replayIndex, drawingHistory]);

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
      {/* 자기소개 가이드 모달 */}
      {isIntroGuideModalOpen && (
        <IntroductionGuideModal
          // onClose={closeIntroGuideModal}
          onConfirm={() =>
            client.send(`/app/game/${roomId}/start-modal/BODY_TALK`)
          }
        />
      )}
      {/* 자기소개 모달 */}
      {isIntroModalOpen && (
        <IntroductionModal
          onClose={closeIntroModal}
          onConfirm={openDrawingWelcomeModal}
        />
      )}
      {/* 이어그리기 행성 입장 */}
      {isDrawingWelcomeModalOpen && (
        <GameInfoModal
          planetImg={blue}
          RedBtnText={"게임 시작"}
          // {/* 게임시작 버튼 누르면 모달 닫고 페이지에서 진행 */}
          RedBtnFn={() => {
            console.log("닫기 요청");
            client.send(`/app/game/${roomId}/start-modal/SAME_POSE`);
          }}
          BlueBtnText={"게임 설명"}
          BlueBtnFn={() =>
            // client.send(`/app/game/${roomId}/start-modal/SAME_POSE`)
            openDrawingGuideModal()
          }
          modalText={"이어그리기 게임에 오신걸 환영합니다 !"}
          // onClose={closeDrawingWelcomeModal}
        />
      )}
      {isDrawingGuideModalOpen && (
        <GameModal
          RedBtnText={"게임 시작"}
          // {/* 게임시작 버튼 누르면 모달 닫고 페이지에서 진행 */}
          RedBtnFn={() => {
            console.log("닫기 요청");
            client.send(`/app/game/${roomId}/start-modal/SAME_POSE`);
          }}
          modalText={
            <>
              주어지는 이미지와 특징을 바탕으로 <br /> 아바타를 그려주세요.{" "}
              <br />
              제한시간은 20초입니다.
            </>
          }
          // onClose={closeDrawingGuideModal}
        />
      )}
      {/* {!isIntroGuideModalOpen && !isIntroModalOpen && !isDrawingWelcomeModalOpen && !isDrawingGuideModalOpen && (
        <Game1Drawing roomId={roomId} />
      )}       */}
      이어그리기 화면 (캔버스)
      {!isIntroGuideModalOpen &&
        !isIntroModalOpen &&
        !isDrawingWelcomeModalOpen &&
        !isDrawingGuideModalOpen && <Game1Drawing />}
      <button onClick={() => navigate("/icebreaking/games/game1NickName")}>
        버튼
      </button>
    </Wrap>
  );
};

export default Game1;
