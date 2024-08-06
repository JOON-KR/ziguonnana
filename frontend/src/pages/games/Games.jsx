import React, { useEffect, useState } from "react";
import pickPlanet from "../../assets/images/pickPlanet.png";
import styled from "styled-components";
import blue from "../../assets/icons/blue.png";
import frozen_blue from "../../assets/icons/frozen_blue.png";
import earth from "../../assets/icons/earth.png";
import frozen_earth from "../../assets/icons/frozen_earth.png";
import orange from "../../assets/icons/orange.png";
import frozen_orange from "../../assets/icons/frozen_orange.png";
import red from "../../assets/icons/red.png";
import frozen_red from "../../assets/icons/frozen_red.png";
import gray from "../../assets/icons/gray.png";
import frozen_gray from "../../assets/icons/frozen_gray.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Wrap = styled.div`
  width: 819px;
  height: 348px;
  background-image: url(${pickPlanet});
  /* background-size: cover; */
  background-position: center;
  background-repeat: no-repeat;
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

const Games = () => {
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const [gameName, setGameName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("--------------------------------");
    console.log("연결 상태 : ", client.connected);
    console.log("--------------------------------");
    if (client && client.connected) {
      client.subscribe(`/topic/game/${roomId}`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        // console.log("게임 종류 선택 메시지:", parsedMessage);
        console.log("게임 종류 응답 메시지 :", parsedMessage.data);

        const gameType = parsedMessage.data;
        if (gameType == "BODY_TALK") {
          navigate("/icebreaking/games/game2");
        } else if (gameType == "SAME_POSE") {
          navigate("/icebreaking/games/game3");
        } else if (gameType == "FOLLOW_POSE") {
          navigate("/icebreaking/games/game4");
        } else if (gameType == "SHORTS") {
          navigate("/icebreaking/games/game5");
        }
      });
    }
  }, [client, roomId]);

  useEffect(() => {
    if (gameName !== "") {
      client.send(`/app/game/${roomId}/game-start/${gameName}`);
      console.log(`게임 선택 메시지 전송: ${gameName}`);
    }
  }, [gameName, client, roomId]);

  const handleGameSelect = (name) => {
    setGameName(name);
  };

  return (
    <Wrap>
      {/* 아바타 행성 */}
      <Planet
        onClick={() => handleGameSelect("AVATAR")}
        src={blue}
        style={{ left: "50px", bottom: "90px" }}
      />
      <PlanetName style={{ left: "83px", bottom: "75px" }}>아바타</PlanetName>
      {/* 몸으로 말해요 행성 */}
      <Planet
        onClick={() => handleGameSelect("BODY_TALK")}
        src={orange}
        style={{ left: "200px", top: "20px" }}
      />
      <PlanetName style={{ left: "200px", top: "0px" }}>
        몸으로 말해요
      </PlanetName>
      {/* 이구동성 행성 */}
      <Planet
        onClick={() => handleGameSelect("SAME_POSE")}
        src={red}
        style={{
          left: "375px",
          bottom: "80px",
          width: "106px",
          height: "120px",
        }}
      />
      <PlanetName style={{ left: "397px", bottom: "65px" }}>
        이구동성
      </PlanetName>
      {/* 포즈 따라하기 행성 */}
      <Planet
        onClick={() => handleGameSelect("FOLLOW_POSE")}
        src={gray}
        style={{ right: "190px", top: "15px", height: "120px" }}
      />
      <PlanetName style={{ right: "205px", top: "4px" }}>
        포즈 따라하기
      </PlanetName>
      {/* 숏폼 챌린지 행성 */}
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
      <PlanetName style={{ right: "10px", bottom: "95px" }}>
        숏폼 챌린지
      </PlanetName>
    </Wrap>
  );
};

export default Games;
