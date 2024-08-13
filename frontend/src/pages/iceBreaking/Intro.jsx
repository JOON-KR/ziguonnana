import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import introGif from "../../assets/gifs/gameIntro.gif";
import firstGame from "../../assets/images/firstGame.png";
import { useSelector } from "react-redux";
import icebreakingBgm from "../../assets/audios/icebreaking.mp3";

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  width: 100%;
  height: 100vh;
  background-color: black;
  padding: 20px 0;
  box-sizing: border-box;
  position: relative;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: calc(100vh - 40px);
  object-fit: contain;
`;

const SkipButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Introduce = () => {
  const [isStoryFinished, setIsStoryFinished] = useState(false);
  const navigate = useNavigate();
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const audioRef = useRef(null); // 오디오를 참조하기 위한 useRef
  const [gameName, setGameName] = useState("");

  useEffect(() => {
    if (client && client.connected) {
      const subscription = client.subscribe(
        `/topic/game/${roomId}`,
        (message) => {
          const parsedMessage = JSON.parse(message.body);
          const cmd = parsedMessage.commandType;

          if (cmd === "GAME_MODAL_START") {
            skipIntro();
          } else if (parsedMessage.commandType === "NANA_MAP") {
            navigate("/icebreaking/games/game1Nickname");
          }

          console.log("키워드 타입 :", parsedMessage);
        }
      );

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [client, roomId]);

  const skipIntro = () => {
    setIsStoryFinished(true);
  };

  useEffect(() => {
    const gifDuration = 16000; // GIF 재생 시간 (밀리초 단위)
    const timer = setTimeout(() => {
      setIsStoryFinished(true);
    }, gifDuration);

    // 오디오 자동 재생
    if (audioRef.current) {
      audioRef.current.play();
    }

    return () => clearTimeout(timer);
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

  return (
    <Wrap>
      <audio ref={audioRef} src={icebreakingBgm} loop /> {/* 배경 음악 */}
      {!isStoryFinished ? (
        <>
          <Image src={introGif} alt="Intro" />
          <button onClick={() => navigate("/icebreaking/games")}>나나맵</button>
          <button onClick={() => navigate("/icebreaking/games/game3")}>
            이구동성으로
          </button>
          <button onClick={() => navigate("/icebreaking/games/game2")}>
            몸말
          </button>
          <button onClick={() => navigate("/icebreaking/games/gameRecord")}>
            결과
          </button>
          <SkipButton
            onClick={() =>
              client.send(`/app/game/${roomId}/start-modal/BODY_TALK`)
            }
          >
            Skip
          </SkipButton>
        </>
      ) : (
        <Image
          src={firstGame}
          onClick={() => {
            // handleGameSelect("AVATAR");
            client.send(`/app/game/${roomId}/game-select`);
          }}
          alt="First Game"
        />
      )}
    </Wrap>
  );
};

export default Introduce;
