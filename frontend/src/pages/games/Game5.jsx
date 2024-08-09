import React, { useState } from "react";
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
  const navigate = useNavigate();

  const closeGuideModalAndStartChallenge = () => {
    setIsGuideModalOpen(false);
    navigate("/icebreaking/games/Game5Dance");
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
