import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import IntroductionGuideModal from "../../components/modals/IntroductionGuideModal";
import IntroductionModal from "../../components/modals/IntroductionModal";
import blue from "../../assets/icons/blue.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setDrawingData } from "../../store/drawingSlice";
import Game1Drawing from "./Game1Drawing";
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

// 자기소개 문답 모달 & 이어그리기 페이지 (Drawing)
const Game1 = () => {
  const [isIntroGuideModalOpen, setIsIntroGuideModalOpen] = useState(true); // IntroductionWelcomeModal 상태
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false); // IntroductionModal 상태
  const [isDrawingWelcomeModalOpen, setIsDrawingWelcomeModalOpen] =
    useState(false); // DrawingWelcomeModal 상태
  const [isDrawingGuideModalOpen, setIsDrawingGuideModalOpen] = useState(false); // DrawingGuideModal 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

        console.log("닫기 요청 데이터1 ", parsedMessage);
        console.log("닫기 요청 데이터2 ", data);

        if (data == "SAME_POSE") {
          setIsDrawingWelcomeModalOpen(false);
          setIsDrawingGuideModalOpen(false);
        } else if (cmd == "GAME_MODAL_START") {
          // setIsIntroGuideModalOpen(false);
          openIntroModal();
        }
        if (parsedMessage.message.trim() === "이어그리기 첫 키워드 전파") {
          // 데이터 받아와서 Redux 상태 업데이트
          dispatch(setDrawingData(data));
          // art 데이터 캔버스에 그리기
          navigate(`/icebreaking/games/game1Drawing`); // Game1Drawing 페이지로 이동
          //모달 닫기
          setIsDrawingWelcomeModalOpen(false);
          setIsDrawingGuideModalOpen(false);
        }
      });
    }
  }, [client, roomId]);

  // IntroductionGuideModal 닫고 IntroductionModal 열기
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

  // DrawingWelcomeModal 닫고 DrawingGuideModal 열기
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

  const saveDrawing = () => {
    canvasRef.current
      .exportPaths()
      .then((paths) => {
        console.log("Saving drawing paths:", paths);
        setDrawingHistory((prev) => [...prev, { paths }]);
      })
      .catch((error) => {
        console.error("Error saving drawing:", error);
        setError("그린 과정 저장 중 오류가 발생했습니다.");
      });
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

  useEffect(() => {
    if (
      !isIntroGuideModalOpen &&
      !isIntroModalOpen &&
      !isDrawingWelcomeModalOpen &&
      !isDrawingGuideModalOpen
    ) {
      if (timeLeft > 0 && !isReplaying) {
        const timer = setTimeout(() => {
          console.log("Timer countdown:", timeLeft);
          setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else if (!isReplaying) {
        saveDrawing();
        switchToNextMember();
      }
    }
  }, [
    timeLeft,
    isIntroGuideModalOpen,
    isIntroModalOpen,
    isDrawingWelcomeModalOpen,
    isDrawingGuideModalOpen,
    isReplaying,
  ]);

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
      {/* {false && ( */}
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
          // RedBtnText={"게임 시작"}
          // // {/* 게임시작 버튼 누르면 모달 닫고 페이지에서 진행 */}
          // RedBtnFn={() => {
          //   console.log("닫기 요청");
          //   client.send(`/app/game/${roomId}/start-modal/SAME_POSE`);
          // }}
          modalText={
            <>
              주어지는 이미지와 특징을 바탕으로 <br /> 아바타를 그려주세요.{" "}
              <br />
              제한시간은 20초입니다. <br /> 잠시만 기다려주세요.
            </>
          }
          // onClose={closeDrawingGuideModal}
        />
      )}
      {/* 이어그리기 화면 (캔버스) */}
      {!isIntroGuideModalOpen &&
        !isIntroModalOpen &&
        !isDrawingWelcomeModalOpen &&
        !isDrawingGuideModalOpen && (
          <>
            {!isReplaying ? (
              <>
                <Header>
                  <ProfileInfo>
                    <ProfileImage
                      src="path/to/profile-image.png"
                      alt="프로필 이미지"
                    />
                    <ProfileDetails>
                      <HeaderText>이름: {members[5]}</HeaderText>{" "}
                      {/* 마지막 멤버를 그리는 중 => 수정 필요*/}
                      <HeaderText>키워드: #뾰족코 #근엄한</HeaderText>
                    </ProfileDetails>
                  </ProfileInfo>
                  <HeaderText>
                    주어진 정보를 활용하여 아바타를 그려주세요!
                  </HeaderText>
                </Header>
                <CanvasWrapper>
                  <ReactSketchCanvas
                    ref={canvasRef}
                    width="970px"
                    height="600px"
                    strokeColor={isEraser ? "#FFFFFF" : brushColor}
                    strokeWidth={brushRadius}
                    eraserWidth={isEraser ? brushRadius : 0}
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
                    <ToolButton
                      onClick={() => setIsEraser(false)}
                      active={!isEraser}
                    >
                      펜
                    </ToolButton>
                    <ToolButton
                      onClick={() => setIsEraser(true)}
                      active={isEraser}
                    >
                      지우개
                    </ToolButton>
                    <Timer>{formatTime(timeLeft)}</Timer>
                  </ToolsWrapper>
                </CanvasWrapper>
              </>
            ) : (
              <CanvasWrapper>
                <ReactSketchCanvas
                  ref={canvasRef}
                  width="970px"
                  height="600px"
                />
              </CanvasWrapper>
            )}
          </>
        )}
      <button onClick={() => navigate("/icebreaking/games/game1NickName")}>
        버튼
      </button>
    </Wrap>
  );
};

export default Game1;
