import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useSelector, useDispatch } from "react-redux";
import BASE_URL from "../../api/APIconfig";
import axios from "axios";

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

const Game1Drawing = () => {
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushRadius, setBrushRadius] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [drawingResult, setDrawingResult] = useState(null);
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [targetUser, setTargetUser] = useState(0);
  const [currentUser, setCurrentUser] = useState(0);
  const [canDraw, setCanDraw] = useState(false);

  const canvasRef = useRef(null);

  const userNo = useSelector((state) => state.auth.userNo);
  const roomId = useSelector((state) => state.room.roomId);
  const dispatch = useDispatch();
  const client = useSelector((state) => state.client.stompClient); // WebSocket 클라이언트

  useEffect(() => {
    console.log("--------------------------------");
    console.log("연결 상태 : ", client.connected);
    console.log("--------------------------------");
    if (client && client.connected) {
      const subscription = client.subscribe(
        `/topic/game/${roomId}`,
        (message) => {
          const parsedMessages = JSON.parse(message.body);
          console.log("그림그리기 수신 메시지 : ", parsedMessages); // 서버로부터 받은 메시지 로그

          //이어그리기 메시지 도착하면 타겟, 권한 유저 번호 설정
          if (parsedMessages.commandType == "ART_RELAY") {
            console.log("타겟, 유저 번호 변경!");
            setTargetUser(parsedMessages.data.targetUser);
            setCurrentUser(parsedMessages.data.currentUser);
          }
        }
      );

      client.send(`/app/game/${roomId}/art-start`);
      //   {
      //     "message": "SUCCESS",
      //     "commandType": "ART_RELAY",
      //     "data": {
      //         "art": "",
      //         "targetUser": 1,
      //         "currentUser": 1,
      //         "keyword": ""
      //     }
      // }

      // 컴포넌트 언마운트 시 구독 취소
      return () => {
        console.log("Unsubscribing from topic:", `/topic/game/${roomId}`);
        subscription.unsubscribe();
      };
    }
  }, [dispatch, roomId, client]);

  //권한 설정
  useEffect(() => {
    setCanDraw(userNo == currentUser ? true : false);
    setTimeLeft(5);
  }, [currentUser]);

  // 타이머
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const imageData = canvasRef.current.exportImage("png");

      client.send();
    }
  }, [timeLeft]);

  const handleColorChange = (color) => {
    setBrushColor(color);
    setIsEraser(false);
  };

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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes} : ${seconds}`;
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
      });
  };

  return (
    <Wrap>
      <Header>
        <ProfileInfo>
          <ProfileImage src="path/to/profile-image.png" alt="프로필 이미지" />
          <ProfileDetails>
            {/* <HeaderText>키워드: {'#' + resData.keyword}</HeaderText> */}
            <h1>{targetUser}님 그리는중~~</h1>
            <h1>{currentUser}님이 그릴 차례</h1>
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
          style={{ pointerEvents: canDraw ? "auto" : "none" }} // 그림 권한 제어
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
            disabled={!canDraw}
          >
            펜
          </ToolButton>
          <ToolButton
            onClick={() => setIsEraser(true)}
            active={isEraser}
            disabled={!canDraw}
          >
            지우개
          </ToolButton>
          <Timer>{formatTime(timeLeft)}</Timer>
        </ToolsWrapper>
      </CanvasWrapper>
      {drawingResult && (
        <div>
          <h2>이어그리기 종료 결과</h2>
          <img src={drawingResult} alt="Drawing Result" />
        </div>
      )}
    </Wrap>
  );
};

export default Game1Drawing;
