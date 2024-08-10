import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useSelector, useDispatch } from "react-redux";
import BASE_URL, { S3_BASE_URL, TAMTAM_URL } from "../../api/APIconfig";
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

  const [targetUser, setTargetUser] = useState(0); //현재 그릴 대상
  const [currentUser, setCurrentUser] = useState(0); //현재 그릴 권한 가진 사람
  const [keyword, setKeyword] = useState("");
  const [prevDrawing, setPrevDrawing] = useState(null); //이전 사람이 그린 그림
  const [avatarList, setAvatarList] = useState([]);
  const [drawingResult, setDrawingResult] = useState(null); //완전히 다 끝난 결과 1인당 이어그린 리스트

  const [isGameEnded, setIsGameEnded] = useState(false);

  const canvasRef = useRef(null);

  const userNo = useSelector((state) => state.auth.userNo);
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);

  useEffect(() => {
    console.log("--------------------------------");
    console.log("연결 상태 : ", client.connected);
    console.log("--------------------------------");
    if (client && client.connected) {
      const subscription = client.subscribe(
        `/topic/game/${roomId}`,
        (message) => {
          const parsedMessages = JSON.parse(message.body);
          // console.log("그림그리기 수신 메시지 : ", parsedMessages); // 서버로부터 받은 메시지 로그

          //이어그리기 메시지 도착하면 타겟, 권한 유저 번호 설정
          if (parsedMessages.commandType == "ART_RELAY") {
            console.log("타겟, 유저 번호 변경!");
            console.log("소켓 서버에서 온 메세지 : ", parsedMessages);
            setPrevDrawing(parsedMessages.data.art); // "https://ziguonnana.s3.ap-northeast-2.amazonaws.com/realyArt/7c8f35b5-521f-444d-8b0f-c643b38795e0.png"

            if (prevDrawing && canvasRef.current) {
              const img = new Image();
              img.src = parsedMessages.data.art;
              img.onload = () => {
                const canvas = canvasRef.current.canvasContainer.childNodes[1]; // ReactSketchCanvas 내부의 실제 <canvas> 엘리먼트를 가져옵니다.
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              };
            }

            console.log(`이전 사람이 그린 그림 : ${prevDrawing}`);
            setTargetUser(parsedMessages.data.targetUser);
            setCurrentUser(parsedMessages.data.currentUser);
            setKeyword(parsedMessages.data.keyword);
            setTimeLeft(5);
            // setPrevDrawing(parsedMessages.data.??) // "shortsExample/3b69b8ec-a35d-4dfa-983a-0093d41bc8e7.png" 같은 형태
          }
          //이어그리기 결과 저장
          else if (parsedMessages.commandType === "ART_END") {
            console.log("이어그리기 결과 받음 :", parsedMessages.data);
            setIsGameEnded(true);
            canvasRef.current.clearCanvas();
            setDrawingResult(parsedMessages.data);
            //To Do : 끝나고 나서 이어그리기 내역 보여주기
          }

          //응답으로 받은 그림을 prevDrawing으로 설정로직 필요
        }
      );

      client.send(`/app/game/${roomId}/art-start`);

      // 컴포넌트 언마운트 시 구독 취소
      return () => {
        console.log("Unsubscribing from topic:", `/topic/game/${roomId}`);
        subscription.unsubscribe();
      };
    }
  }, []);
  // }, [ roomId, client]);

  //이전 사람이 그린 그림 받으면 현재 캔버스에 반영
  // useEffect(() => {
  //   if (prevDrawing && canvasRef.current) {
  //     const img = new Image();
  //     img.src = prevDrawing;
  //     img.onload = () => {
  //       const canvas = canvasRef.current.canvasContainer.childNodes[1]; // ReactSketchCanvas 내부의 실제 <canvas> 엘리먼트를 가져옵니다.
  //       const ctx = canvas.getContext("2d");
  //       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  //     };
  //   }
  // }, [prevDrawing]);

  //그리는 대상 변하면 캔버스 비워주기
  useEffect(() => {
    canvasRef.current.clearCanvas();
  }, [targetUser]);

  // 5부터 감소, 0미만 되면 s3로 png이미지 axios 전송, 받은 응답을 소켓으로 전송
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

  //현재 캔버스에서 그려진 그림 png형태로 추출해서 서버로 전송, 서버에서 받은 응답을 소켓으로 전송
  const handleSendDrawing = async () => {
    const currentCanvas = canvasRef.current;
    if (currentCanvas && currentUser == userNo) {
      const exportImage = await currentCanvas.exportImage("png");
      const imageBlob = await (await fetch(exportImage)).blob();
      const formData = new FormData();
      formData.append("file", imageBlob, "drawing.png");

      const response = await axios.post(`${TAMTAM_URL}/api/v1/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("S3 전송해서 받은 결과 : ", response);
      console.log("S3에서 받은 그림 : ", response.data); // "shortsExample/18ea86bf-17f6-4466-8df0-365cff321a80.png"

      console.log("S3에서 받은 결과 전송!");
      client.send(`/app/game/${roomId}/saveArt`, {}, response.data);
    }
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
  const handleColorChange = (color) => {
    setBrushColor(color);
    setIsEraser(false);
  };
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
            {!isGameEnded ? (
              <>
                <h1>{targetUser}님 그리는중~~</h1>
                <h1>{currentUser}님이 그릴 차례</h1>
                <h1>키워드 : {keyword}</h1>
              </>
            ) : (
              <h1>이어그리기 종료!</h1>
            )}
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
          style={{ pointerEvents: userNo == currentUser ? "auto" : "none" }} // 그림 권한 제어
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
            disabled={!(userNo == currentUser)}
          >
            펜
          </ToolButton>
          <ToolButton
            onClick={() => setIsEraser(true)}
            active={isEraser}
            disabled={!(userNo == currentUser)}
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

// {
//   "art": "\"shortsExample/08d94bda-9047-4d7d-8526-c8e9854ec68f.png\"",
//   "targetUser": 3,
//   "currentUser": 2,
//   "keyword": "c"
// }
