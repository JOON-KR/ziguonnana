import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import IntroductionGuideModal from "../../components/modals/IntroductionGuideModal";
import IntroductionModal from "../../components/modals/IntroductionModal";
import blue from "../../assets/icons/blue.png";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useNavigate } from "react-router-dom";

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

const Game1 = ({ roomId }) => {
  const [isIntroGuideModalOpen, setIsIntroGuideModalOpen] = useState(true); // IntroductionWelcomeModal 상태
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false); // IntroductionModal 상태
  const [isDrawingWelcomeModalOpen, setIsDrawingWelcomeModalOpen] = useState(false); // DrawingWelcomeModal 상태
  const [isDrawingGuideModalOpen, setIsDrawingGuideModalOpen] = useState(false); // DrawingGuideModal 상태
  const [brushColor, setBrushColor] = useState("#000000"); // 브러시 색상 상태
  const [brushRadius, setBrushRadius] = useState(5); // 브러시 크기 상태
  const [isEraser, setIsEraser] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [memberId, setMemberId] = useState(''); // 현재 사용자 ID 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [drawingHistory, setDrawingHistory] = useState([]); // 그린 과정 저장
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const navigate = useNavigate();

  const openIntroModal = () => {
    setIsIntroGuideModalOpen(false);
    setIsIntroModalOpen(true);
  };

  const closeIntroGuideModal = () => {
    setIsIntroGuideModalOpen(false);
  };

  const closeIntroModal = () => {
    setIsIntroModalOpen(false);
  };

  const openDrawingWelcomeModal = () => {
    setIsIntroModalOpen(false);
    setIsDrawingWelcomeModalOpen(true);
  };

  const closeDrawingWelcomeModal = () => {
    setIsDrawingWelcomeModalOpen(false);
  };

  const closeDrawingGuideModal = () => {
    setIsDrawingGuideModalOpen(false);
  };

  const openDrawingGuideModal = () => {
    setIsDrawingWelcomeModalOpen(false);
    setIsDrawingGuideModalOpen(true);
  };

  const handleColorChange = (color) => {
    setBrushColor(color);
    setIsEraser(false);
  };

  const saveDrawing = () => {
    canvasRef.current
      .exportPaths()
      .then((paths) => {
        setDrawingHistory((prev) => [...prev, paths]);
      })
      .catch((error) => {
        setError("그린 과정 저장 중 오류가 발생했습니다.");
      });
  };

  const startReplay = () => {
    setIsReplaying(true);
    setReplayIndex(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (!isIntroGuideModalOpen && !isIntroModalOpen && !isDrawingWelcomeModalOpen && !isDrawingGuideModalOpen) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
          saveDrawing();
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        startReplay();
      }
    }
  }, [timeLeft, isIntroGuideModalOpen, isIntroModalOpen, isDrawingWelcomeModalOpen, isDrawingGuideModalOpen]);

  const replayDrawing = () => {
    if (replayIndex < drawingHistory.length) {
      canvasRef.current.clearCanvas();
      canvasRef.current.loadPaths(drawingHistory[replayIndex]);
      setReplayIndex(replayIndex + 1);
      animationFrameRef.current = setTimeout(replayDrawing, 500);
    }
  };
  
  const next = navigate('/icebreaking/games/game1NickName');

  useEffect(() => {
    if (isReplaying) {
      animationFrameRef.current = setTimeout(replayDrawing, 500);
    }
    return () => clearTimeout(animationFrameRef.current);
  }, [isReplaying, replayIndex, drawingHistory]);

  const colors = [
    "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF", "#000000", "#FFFFFF",
    "#A52A2A", "#D2691E", "#DAA520", "#808000", "#008000", "#008080", "#00FFFF", "#4682B4", "#00008B",
    "#8A2BE2", "#FF1493", "#D3D3D3", "#A9A9A9"
  ];

  return (
    <Wrap>
      {error && <div style={{ color: "red" }}>{error}</div>} {/* 에러 메시지 표시 */}
      {isIntroGuideModalOpen && (
        <IntroductionGuideModal onClose={closeIntroGuideModal} onConfirm={openIntroModal} />
      )}
      {isIntroModalOpen && (
        <IntroductionModal onClose={openDrawingWelcomeModal} />
      )}
      {isDrawingWelcomeModalOpen && (
        <GameInfoModal 
          planetImg={blue}
          RedBtnText={"게임 시작"}     
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
          RedBtnFn={closeDrawingGuideModal}
          modalText={(
            <>
              주어지는 이미지와 특징을 바탕으로 <br /> 아바타를 그려주세요. <br />
              제한시간은 20초입니다.
            </>
          )}
          onClose={closeDrawingGuideModal}
        />
      )}
      {!isIntroGuideModalOpen && !isIntroModalOpen && !isDrawingWelcomeModalOpen && !isDrawingGuideModalOpen && (
        <>
          <Header>
            <ProfileInfo>
              <ProfileImage src="path/to/profile-image.png" alt="프로필 이미지" />
              <ProfileDetails>
                <HeaderText>이름: 홍길동</HeaderText>
                <HeaderText>키워드: #뾰족코 #근엄한</HeaderText>
              </ProfileDetails>
            </ProfileInfo>
            <HeaderText>주어진 정보를 활용하여 아바타를 그려주세요!</HeaderText>
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
              <ToolButton onClick={() => setIsEraser(false)} active={!isEraser}>
                펜
              </ToolButton>
              <ToolButton onClick={() => setIsEraser(true)} active={isEraser}>
                지우개
              </ToolButton>
              <Timer>{formatTime(timeLeft)}</Timer>
            </ToolsWrapper>
          </CanvasWrapper>
          <button onClick={next}>별명짓기페이지</button>
        </>
      )}
    </Wrap>
  );
};

export default Game1;
