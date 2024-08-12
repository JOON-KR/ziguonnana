import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GameInfoModal from "../../components/modals/GameInfoModal";
import GameModal from "../../components/modals/GameModal";
import styled from "styled-components";
import earth from "../../assets/icons/earth.png";

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Game5 = () => {
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const client = useSelector((state) => state.client.stompClient);
  const roomId = useSelector((state) => state.room.roomId);
  const navigate = useNavigate();

  useEffect(() => {
    if (client && client.connected) {
      const subscription = client.subscribe(`/topic/game/${roomId}`, (message) => {
        const response = JSON.parse(message.body);
        if (
          response.commandType === "GAME_MODAL_START" &&
          response.data === "SHORTS"
        ) {
          navigate("/icebreaking/games/Game5Dance");
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [client, roomId, navigate]);

  const closeGuideModalAndStartChallenge = () => {
    setIsGuideModalOpen(false);
    if (client && client.connected) {
      client.send(
        `/app/game/${roomId}/start-modal/SHORTS`,
        {},
        JSON.stringify({
          message: "SUCCESS",
          commandType: "GAME_MODAL_START",
          data: "SHORTS",
        })
      );
    }
  };

  return (
    <Wrap>
      {isWelcomeModalOpen && (
        <GameInfoModal
          planetImg={earth}
          planetWidth="180px"
          RedBtnText={"댄스 챌린지"}
          RedBtnFn={() => {
            setIsWelcomeModalOpen(false);
            setIsGuideModalOpen(true);
          }}
          modalText={<>숏폼 챌린지에 오신걸 환영합니다 !</>}
        />
      )}
      {isGuideModalOpen && (
        <GameModal
          RedBtnText={"챌린지 시작"}
          RedBtnFn={closeGuideModalAndStartChallenge}
          modalText={
            <>
              댄스 챌린지를 선택하셨습니다.
              <br />
              챌린지(EX. 마라탕후루) 영상을
              <br />
              한 가지 선택 후, 릴레이 촬영으로 <br />
              댄스 챌린지 영상을 완성해봅시다!
            </>
          }
        />
      )}
    </Wrap>
  );
};

export default Game5;
