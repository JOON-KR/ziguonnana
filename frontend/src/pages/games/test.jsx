import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useSelector, useDispatch } from "react-redux";
import BASE_URL from "../../api/APIconfig";
import { setDrawingData } from "../../store/drawingSlice";
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
  const canvasRef = useRef(null);

  const userNo = useSelector((state) => state.auth.userNo);
  const roomId = useSelector((state) => state.room.roomId);
  const drawingData = useSelector((state) => state.drawing.drawingData);
  const dispatch = useDispatch();
  const stompClient = useSelector((state) => state.client.stompClient); // WebSocket 클라이언트

  useEffect(() => {
    // 이어그리기 첫 키워드 전파 데이터 받아오기
    // num(userNo와 같은 데이터만 사용하면 됨), keyword 데이터 받아오기
    if (stompClient && stompClient.connected) {
      console.log("Subscribing to topic:", `/topic/game/${roomId}`);
      // 방의 메시지를 구독
      const subscription = stompClient.subscribe(
        `/topic/game/${roomId}`,
        (message) => {
          const response = JSON.parse(message.body);
          console.log("Received message from server:", response); // 서버로부터 받은 메시지 로그
          if (response.message.trim() === "이어그리기 첫 키워드 전파") {
            // 데이터 받아와서 Redux 상태 업데이트
            dispatch(setDrawingData(response.data));
          }
        }
      );

      // 컴포넌트 언마운트 시 구독 취소
      return () => {
        console.log("Unsubscribing from topic:", `/topic/game/${roomId}`);
        subscription.unsubscribe();
      };
    } else {
      console.error("Stomp client is not connected in useEffect");
    }
  }, [dispatch, roomId, stompClient]);

  const resData = drawingData[userNo];
  // console.log("resDatad:", resData);
  // console.log('drawing', drawingData)

  // 타이머
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      handleSendDrawing();
    }
  }, [timeLeft]);

  // 응답 받아오면 캔버스 띄우기
  useEffect(() => {
    if (drawingData[userNo] && drawingData[userNo].art) {
      const canvas = canvasRef.current;
      if (canvas) {
        console.log("Loading paths:", drawingData[userNo].art);
        canvas.clearCanvas();
        canvas.loadPaths(JSON.parse(drawingData[userNo].art));
      }
    }
  }, [drawingData, userNo]);

  // 중간 그림 저장
  const [savedDrawing, setSavedDrawing] = useState("");

  const handleSendDrawing = async () => {
    const currentCanvas = canvasRef.current;
    if (currentCanvas) {
      try {
        // 캔버스에 그린 그림을 png 파일로 저장 <- 저장 잘되는지 모르겠음.
        const exportImage = await currentCanvas.exportImage("png");
        const imageBlob = await (await fetch(exportImage)).blob();
        const formData = new FormData();
        formData.append("file", imageBlob, "drawing.png");

        // 저장한 png 파일을 S3 서버로 전송 - multipart 형식으로
        const response = await axios.post(`${BASE_URL}/api/v1/file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("S3 전송해서 받은 결과 : ", response);
        // S3 서버에서 받아온 response data 저장
        setSavedDrawing(response.data);
        console.log("Drawing sent successfully:", response.data);

        // S3 서버에서 받아온 response data를 서버로 전송 (소켓)
        // relayart 데이터 형식으로 전송
        const relayart = {
          art: resData.art,
          num: userNo,
          keyword: resData.keyword,
        };

        const sendDrawingInterval = setInterval(() => {
          if (stompClient && stompClient.connected) {
            stompClient.send(
              `/app/game/${roomId}/saveArt`,
              {},
              JSON.stringify(relayart)
            );
            console.log("Data sent to server via socket:", relayart);
          }
        }, 5000); // 5초 간격으로 데이터 전송

        // 응답 처리 및 반복 종료
        const subscription = stompClient.subscribe(
          `/topic/game/${roomId}`,
          (message) => {
            const response = JSON.parse(message.body);
            console.log("Received repeated message from server:", response);
            // 그림 전파 데이터 받아오기
            if (response.message.trim() === "그림 전파") {
              // 데이터 받아와서 Redux 상태 업데이트
              dispatch(setDrawingData(response.data));
            }
            // 이어그리기 종료 데이터 받아오기
            if (response.message.trim() === "이어그리기 종료") {
              // 새로운 변수에 그림 저장
              setDrawingResult(response.data);
              console.log("Drawing result received:", response.data);
              // 데이터 반복 전송 종료
              clearInterval(sendDrawingInterval);
              subscription.unsubscribe();
            }

            resData = Object.values(drawingData)[1];
          }
        );

        return () => {
          clearInterval(sendDrawingInterval);
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error sending drawing:", error);
      }
    }
  };

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

  return (
    <Wrap>
      <Header>
        <ProfileInfo>
          <ProfileImage src="path/to/profile-image.png" alt="프로필 이미지" />
          <ProfileDetails>
            {/* <HeaderText>키워드: {'#' + resData.keyword}</HeaderText> */}
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
