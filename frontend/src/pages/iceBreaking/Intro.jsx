import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import introGif from "../../assets/gifs/gameIntro.gif";
import firstGame from "../../assets/images/firstGame.png";
import { useSelector } from "react-redux";

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  width: 100%;
  height: 100vh; /* Fullscreen */
  background-color: black;
  padding: 20px 0; /* Add top and bottom padding for spacing */
  box-sizing: border-box;
  position: relative; /* For positioning the skip button */
`;

const Image = styled.img`
  max-width: 100%;
  max-height: calc(100vh - 40px); /* Adjust to fit within the padding */
  object-fit: contain; /* Keep aspect ratio while fitting within the container */
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

  useEffect(() => {
    client.subscribe(`/topic/game/${roomId}`, (message) => {
      const parsedMessage = JSON.parse(message.body);

      const cmd = parsedMessage.commandType;

      if (cmd == "GAME_MODAL_START") {
        skipIntro();
      }

      console.log("키워드 타입 :", parsedMessage);
    });
  }, [client, roomId]);

  const skipIntro = () => {
    setIsStoryFinished(true);
  };

  useEffect(() => {
    const gifDuration = 16000; // GIF 재생 시간 (밀리초 단위)
    const timer = setTimeout(() => {
      setIsStoryFinished(true);
    }, gifDuration);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <Wrap>
      {!isStoryFinished ? (
        <>
          <Image src={introGif} alt="Intro" />
          <button onClick={() => navigate("/icebreaking/games/game5")}>
            숏폼 페이지로 이동
          </button>
          <button onClick={() => navigate("/icebreaking/games/game2")}>몸말</button>
          <button onClick={() => navigate("/icebreaking/games/game4")}>포즈</button>
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
            navigate("/icebreaking/games/game1Nickname");
          }}
          alt="First Game"
        />
      )}
    </Wrap>
  );
};

export default Introduce;