import React, { useEffect, useState } from "react";
import pickPlanet from "../../assets/images/pickPlanet.png";
import styled from "styled-components";
import blue from "../../assets/icons/blue.png";
import earth from "../../assets/icons/earth.png";
import frozen_earth from "../../assets/icons/frozen_earth.png";
import orange from "../../assets/icons/orange.png";
import frozen_orange from "../../assets/icons/frozen_orange.png";
import red from "../../assets/icons/red.png";
import frozen_red from "../../assets/icons/frozen_red.png";
import gray from "../../assets/icons/gray.png";
import frozen_gray from "../../assets/icons/frozen_gray.png";
import { useNavigate, useLocation, useFetcher } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../store/messageSlice";
import nextBtn from "../../assets/icons/next_btn.png";
import GameEndModal from "../../components/modals/GameEndModal";

const Wrap = styled.div`
  width: 819px;
  height: 348px;
  background-image: url(${pickPlanet});
  /* background-size: cover; */
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
`;



const Title = styled.h2`
  font-size: 35px;
`;

const Planet = styled.img`
  position: absolute;
  width: 115px;
  height: 100px;
  cursor: pointer;
`;

const PlanetName = styled.p`
  position: absolute;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
`;

const BottomContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 300px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DoneButton = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
   background-color: transparent; /* 배경을 투명하게 설정 */
`;

const NextImage = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;


const Games = () => {
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const game1Status = useSelector((state) => state.result.isGame1Finished);
  const game2Status = useSelector((state) => state.result.isGame2Finished);
  const game3Status = useSelector((state) => state.result.isGame3Finished);
  const game4Status = useSelector((state) => state.result.isGame4Finished);
  const game5Status = useSelector((state) => state.result.isGame5Finished);

  const [gameName, setGameName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEndModalOpen, setIsEndModalOpen] = useState(false); // 모달 상태 관리

  const closeEndModal = () => {
    setIsEndModalOpen(false);
  };


  useEffect(() => {
    console.log("--------------------------------");
    console.log("연결 상태 : ", client.connected);
    console.log("--------------------------------");
    if (client && client.connected) {
      const subscription = client.subscribe(
        `/topic/game/${roomId}`,
        (message) => {
          const parsedMessage = JSON.parse(message.body);
          // console.log("게임 종류 선택 메시지:", parsedMessage);
          console.log("게임 종류 응답 메시지 :", parsedMessage.data);
          dispatch(setMessage(parsedMessage.data));

          const gameType = parsedMessage.data;
          if (gameType === "BODY_TALK") {
            navigate("/icebreaking/games/game2");
          } else if (gameType === "SAME_POSE") {
            navigate("/icebreaking/games/game3");
          } else if (gameType === "FOLLOW_POSE") {
            navigate("/icebreaking/games/game4");
          } else if (gameType === "SHORTS") {
            navigate("/icebreaking/games/game5");
          }
        }
      );

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [client, roomId]);

  useEffect(() => {
    console.log(game1Status);
    console.log(game2Status);
    console.log(game3Status);
    console.log(game4Status);
    console.log(game5Status);
  }, []);

  //한번만 보내야됨
  useEffect(() => {
    if (gameName !== "") {
      client.send(`/app/game/${roomId}/game-start/${gameName}`);
      console.log(`게임 선택 메시지 전송: ${gameName}`);
    }
  }, [gameName, client, roomId]);

  const handleGameSelect = (name) => {
    setGameName(name);
  };

  const handleNext = () => {
    setIsEndModalOpen(true); // 버튼 클릭 시 모달 열기
  };

  return (
    <Wrap>
      {/* 아바타 행성 */}
      <Planet src={blue} style={{ left: "50px", bottom: "90px" }} />

      <PlanetName style={{ left: "83px", bottom: "75px" }}>아바타</PlanetName>
      {/* 몸으로 말해요 행성 */}
      {!game2Status ? (
        <Planet
          onClick={() => handleGameSelect("BODY_TALK")}
          src={frozen_orange}
          style={{ left: "200px", top: "20px" }}
        />
      ) : (
        <Planet src={orange} style={{ left: "200px", top: "20px" }} />
      )}

      <PlanetName style={{ left: "200px", top: "0px" }}>
        몸으로 말해요
      </PlanetName>
      {/* 이구동성 행성 */}

      {!game3Status ? (
        <Planet
          onClick={() => handleGameSelect("SAME_POSE")}
          src={frozen_red}
          style={{
            left: "375px",
            bottom: "80px"
          }}
        />
      ) : (
        <Planet
          src={red}
          style={{
            left: "375px",
            bottom: "80px",
            width: "106px",
            height: "120px",
          }}
        />
      )}

      <PlanetName style={{ left: "397px", bottom: "65px" }}>
        이구동성
      </PlanetName>
      {/* 포즈 따라하기 행성 */}
      {!game4Status ? (
        <Planet
          onClick={() => handleGameSelect("FOLLOW_POSE")}
          src={frozen_gray}
          style={{ right: "190px", top: "15px", height: "120px" }}
        />
      ) : (
        <Planet
          src={gray}
          style={{ right: "190px", top: "15px", height: "120px" }}
        />
      )}

      <PlanetName style={{ right: "205px", top: "4px" }}>
        포즈 따라하기
      </PlanetName>
      {/* 숏폼 챌린지 행성 */}
      {!game5Status ? (
        <Planet
          onClick={() => handleGameSelect("SHORTS")}
          src={frozen_earth}
          style={{
            right: "-20px",
            bottom: "100px",
            width: "130px",
            height: "110px",
          }}
        />
      ) : (
        <Planet
          onClick={() => handleGameSelect("SHORTS")}
          src={earth}
          style={{
            right: "-20px",
            bottom: "100px",
            width: "130px",
            height: "110px",
          }}
        />
      )}

      <PlanetName style={{ right: "10px", bottom: "95px" }}>
        숏폼 챌린지
      </PlanetName>

      <BottomContainer>
        <DoneButton onClick={handleNext}>게임 끝내기</DoneButton>
        <NextImage src={nextBtn} alt="Next" onClick={handleNext} />
      </BottomContainer>

      {isEndModalOpen && <GameEndModal onClose={closeEndModal} />}

    </Wrap>
  );
};

export default Games;
