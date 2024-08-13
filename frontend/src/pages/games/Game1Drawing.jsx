import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import BASE_URL from "../../api/APIconfig";
import { useNavigate } from "react-router-dom";
import AvatarCard from "../../components/avatarCard/AvatarCard";
import { setGame1Finish } from "../../store/resultSlice";

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

const Text = styled.h1`
  margin: 12px;
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
  const [timeLeft, setTimeLeft] = useState(8);
  const [targetUser, setTargetUser] = useState(0);
  const [currentUser, setCurrentUser] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [drawingResult, setDrawingResult] = useState(null);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [lastSentPaths, setLastSentPaths] = useState([]);

  const canvasRef = useRef(null);
  const userNo = useSelector((state) => state.auth.userNo);
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const [isStarted, setIsStarted] = useState(false);
  const navigate = useNavigate();
  const [avatarCards, setAvatarCards] = useState([]); // 아바타명함(이미지, 특징, 닉네임)
  const dispatch = useDispatch();

  useEffect(() => {
    if (client && client.connected) {
      const subscription = client.subscribe(
        `/topic/game/${roomId}`,
        (message) => {
          const parsedMessages = JSON.parse(message.body);

          if (parsedMessages.commandType === "AVATAR_CARD") {
            // AvatarCard
            setAvatarCards(parsedMessages.data[userNo]);
            console.log(parsedMessages.data[userNo]);
          }
          if (parsedMessages.commandType === "ART_RELAY") {
            setTargetUser(parsedMessages.data.targetUser);
            setCurrentUser(parsedMessages.data.currentUser);
            setKeyword(parsedMessages.data.keyword);
            setTimeLeft(8);
            setIsStarted(true);
          } else if (parsedMessages.commandType === "DRAW_PREV") {
            canvasRef.current.loadPaths(parsedMessages.data);
          } else if (parsedMessages.commandType === "ART_END") {
            setIsGameEnded(true);
            setCurrentUser(0);
            canvasRef.current.clearCanvas();
            setDrawingResult(parsedMessages.data);
          } else if (parsedMessages.commandType === "ART_CYCLE") {
            canvasRef.current.clearCanvas();
          } else if (parsedMessages.commandType === "NANA_MAP") {
            dispatch(setGame1Finish());
            navigate("/icebreaking/games");
          }
        }
      );

      client.send(`/app/game/${roomId}/art-start`);

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [client, roomId]);

  // useEffect(() => {
  //   canvasRef.current.clearCanvas();
  // }, [targetUser]);

  useEffect(() => {
    if (!isGameEnded) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        if (isStarted) {
          handleSendDrawing();
        }
      }
    }
  }, [timeLeft]);

  const handleSendDrawing = async () => {
    const currentCanvas = canvasRef.current;
    if (currentCanvas) {
      const exportImage = await currentCanvas.exportImage("png");
      const imageBlob = await (await fetch(exportImage)).blob();
      const formData = new FormData();
      formData.append("file", imageBlob, "drawing.png");

      const response = await axios.post(`${BASE_URL}/api/v1/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("S3 전송해서 받은 결과 : ", response);

      console.log("S3에서 받은 결과 전송!");
      if (currentUser == userNo) {
        client.send(
          `/app/game/${roomId}/saveArt`,
          {},
          JSON.stringify(response.data)
        );
      }
    }
  };

  const simplifyPath = (path, tolerance = 1.0) => {
    if (!path || path.length <= 2) return path;

    const sqTolerance = tolerance * tolerance;

    const simplifyDPStep = (points, first, last, sqTolerance, simplified) => {
      let maxSqDist = sqTolerance;
      let index = null;

      for (let i = first + last; i < last; i++) {
        const sqDist = getSquareSegmentDistance(
          points[i],
          points[first],
          points[last]
        );

        if (sqDist > maxSqDist) {
          index = i;
          maxSqDist = sqDist;
        }
      }

      if (maxSqDist > sqTolerance) {
        if (index - first > 1)
          simplifyDPStep(points, first, index, sqTolerance, simplified);
        simplified.push(points[index]);
        if (last - index > 1)
          simplifyDPStep(points, index, last, sqTolerance, simplified);
      }
    };

    const getSquareDistance = (p1, p2) => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      return dx * dx + dy * dy;
    };

    const getSquareSegmentDistance = (p, p1, p2) => {
      let x = p1.x;
      let y = p1.y;
      const dx = p2.x - x;
      const dy = p2.y - y;

      if (dx !== 0 || dy !== 0) {
        const t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
          x = p2.x;
          y = p2.y;
        } else if (t > 0) {
          x += dx * t;
          y += dy * t;
        }
      }

      const d2 = (p.x - x) ** 2 + (p.y - y) ** 2;

      return d2;
    };

    const simplified = [path[0]];
    simplifyDPStep(path, 0, path.length - 1, sqTolerance, simplified);
    simplified.push(path[path.length - 1]);

    return simplified;
  };

  const handleMouseUp = async () => {
    if (canvasRef.current && currentUser === userNo) {
      const currentPaths = await canvasRef.current.exportPaths();
      const simplifiedPaths = currentPaths.map((path) => ({
        ...path,
        path: simplifyPath(path.path),
      }));

      const newPaths = simplifiedPaths.filter(
        (path, index) =>
          index >= lastSentPaths.length ||
          JSON.stringify(path) !== JSON.stringify(lastSentPaths[index])
      );

      if (newPaths.length > 0) {
        console.log("전송할 경로 데이터:", JSON.stringify(newPaths, null, 2)); // 전송할 데이터를 콘솔에 출력
        client.send(
          `/app/game/${roomId}/draw`,
          {},
          JSON.stringify(newPaths[newPaths.length - 1])
        );
        setLastSentPaths(simplifiedPaths);
      }
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
    return `${minutes}:${seconds}`;
  };
  return (
    <Wrap>
      {isGameEnded ? (
        <>
          <Text>이어그리기가 종료되었습니다.</Text>
          <h1>당신의 아바타 명함이 제작되었습니다 :)</h1>
          <AvatarCard
            avatarImage={avatarCards.avatarImage}
            nickname={avatarCards.nickname}
            features={avatarCards.features}
          />
          <button
            onClick={() => {
              client.send(`/app/game/${roomId}/game-select`);
            }}
          >
            다른 게임들 보러가기
          </button>
          {/* gameRecord에서 가져오기 */}
          {/* <ButtonContainer onClick={handleRecordDetail}>
            <ButtonText>게임상세</ButtonText>
            <IconImage src={recordBtn} alt="gameRecordBtn" />
          </ButtonContainer> */}
        </>
      ) : (
        <>
          <Header>
            <ProfileInfo>
              <ProfileImage
                src="path/to/profile-image.png"
                alt="프로필 이미지"
              />
              <ProfileDetails>
                <h1>{targetUser}님 그리는중~~</h1>
                <h1>{currentUser}님이 그릴 차례</h1>
                <h1>키워드 : {keyword}</h1>
              </ProfileDetails>
            </ProfileInfo>
            <HeaderText>주어진 정보를 활용하여 아바타를 그려주세요!</HeaderText>
          </Header>
          <CanvasWrapper onMouseUp={handleMouseUp}>
            <ReactSketchCanvas
              ref={canvasRef}
              width="970px"
              height="600px"
              strokeColor={isEraser ? "#FFFFFF" : brushColor}
              strokeWidth={brushRadius}
              eraserWidth={isEraser ? brushRadius : 0}
              style={{ pointerEvents: userNo == currentUser ? "auto" : "none" }}
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
        </>
      )}
      {/* {drawingResult && (
        <div>
          <Text>이어그리기 종료 결과</Text>
          <img src={drawingResult} alt="Drawing Result" />
        </div>
      )} */}
    </Wrap>
  );
};

export default Game1Drawing;

// ("https://ziguonnana.s3.ap-northeast-2.amazonaws.com/realyArt/b0adaf11-9e0f-4d9d-87b3-67cfb3f34ede.png");
