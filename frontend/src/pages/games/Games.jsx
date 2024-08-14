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
import Nana from "../../assets/icons/nana.png";  
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../store/messageSlice";
import GameEndModal from "../../components/modals/GameEndModal";

const Container = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
`;

const Title = styled.h2`
  font-size: 35px;
  text-align: center;
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1; /* 타이틀의 z-index를 낮게 설정 */
`;

const Wrap = styled.div`
  width: 819px;
  height: 348px;
  background-image: url(${pickPlanet});
  background-position: center;
  background-repeat: no-repeat;
  margin: 0 auto;
  margin-top: 50px;
  position: relative;
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

const NanaImage = styled.img`
  position: absolute;
  width: 120px;
  height: 130px;
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
  const [subscribed, setSubscribed] = useState(false);
  const dispatch = useDispatch();

  const [isEndModalOpen, setIsEndModalOpen] = useState(false); // 모달 상태 관리

  const closeEndModal = () => {
    setIsEndModalOpen(false);
  };

  useEffect(() => {
    if (client && client.connected && !subscribed) {
      client.subscribe(`/topic/game/${roomId}`, (message) => {
        const parsedMessage = JSON.parse(message.body);

        // 서버 응답 Redux 스토어에 저장
        dispatch(setMessage(parsedMessage.data));

        // 모달 열기 응답 처리
        if (parsedMessage.commandType === "GAME_MODAL_START" && parsedMessage.data === "END") {
          setIsEndModalOpen(true); // 모든 클라이언트에서 모달을 엽니다
        }

        // 게임 타입에 따른 네비게이션 처리
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
      });
      setSubscribed(true);
    }
  }, [client, roomId, subscribed]);

  useEffect(() => {
    if (gameName !== "") {
      client.send(`/app/game/${roomId}/game-start/${gameName}`);
    }
  }, [gameName, client, roomId]);

  const handleGameSelect = (name) => {
    setGameName(name);
  };

  const handleNext = () => {
    //모달 열기 전송
    client.send(`/app/game/${roomId}/start-modal/END`, {});
    // setIsEndModalOpen(true); // 버튼 클릭 시 모달 열기
  };

  return (
    <Container>
      <Title>NANA’S ICE-BREAKING MAP</Title>
      
      <Wrap>
        <Planet src={blue} style={{ left: "50px", bottom: "90px" }} />
        <PlanetName style={{ left: "83px", bottom: "75px" }}>아바타</PlanetName>

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

        {!game4Status ? (
          <Planet
            onClick={() => handleGameSelect("FOLLOW_POSE")}
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
        <PlanetName style={{ left: "380px", bottom: "65px" }}>
          포즈 따라하기
        </PlanetName>

        {!game5Status ? (
          <Planet
            onClick={() => handleGameSelect("SHORTS")}
            src={frozen_gray}
            style={{ right: "190px", top: "15px", height: "120px" }}
          />
        ) : (
          <Planet
            onClick={() => handleGameSelect("SHORTS")}
            src={gray}
            style={{ right: "190px", top: "15px", height: "120px" }}
          />
        )}
        <PlanetName style={{ right: "205px", top: "4px" }}>
          숏폼 챌린지
        </PlanetName>

        <Planet
          onClick={handleNext}
          src={earth}
          style={{
            right: "-20px",
            bottom: "100px",
            width: "130px",
            height: "110px",
          }}
        />
        <NanaImage 
          onClick={handleNext}
          src={Nana} 
          style={{ 
            right: "1px", 
            bottom: "130px" 
          }} 
        /> 
        <PlanetName style={{ right: "10px", bottom: "95px" }}>
          게임 끝내기
        </PlanetName>

        {isEndModalOpen && (
          <GameEndModal onClose={closeEndModal} style={{ zIndex: 100 }} />
        )}
      </Wrap>
    </Container>
  );
};

export default Games;
