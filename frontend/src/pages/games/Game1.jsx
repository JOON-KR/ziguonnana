import React, { useState } from "react";
import GameInfoModal from "../../components/modals/GameInfoModal";
import blue from "../../assets/icons/blue.png";
import styled from "styled-components";
import IntroductionGuideModal from "../../components/modals/IntroductionGuideModal";
import IntroductionModal from "../../components/modals/IntroductionModal";

const Wrap = styled.div`
display: flex;
justify-content: center;
align-items: center;
width: 100%;
flex-direction: column;
text-align: center;
`;

// 자기소개 문답 페이지
const Game1 = () => {
  const [isIntroGuideModalOpen, setIsIntroGuideModalOpen] = useState(true);
  // IntroductionModal vs GameInfoModal 둘 중 하나로 ㄱ
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const [isGameInfoModalOpen, setIsGameInfoModalOpen] = useState(false);
  const [error, setError] = useState("");

  const openIntroModal = () => {
    setIsIntroGuideModalOpen(false);
    setIsIntroModalOpen(true);
  };

  const closeIntroGuideModal = () => {
    setIsIntroGuideModalOpen(false);
  };

  const closeIntroModal = () => {
    setIsIntroModalOpen(false);
  };
  
  return (
    <Wrap>
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* {isGameInfoModalOpen && (
        <GameInfoModal onClose={closeIntroModal} />
      )} */}
      
      {isIntroGuideModalOpen && (
        <IntroductionGuideModal onClose={closeIntroGuideModal} onConfirm={openIntroModal} />
      )}
      {isIntroModalOpen && (
        <IntroductionModal onClose={closeIntroModal} />
      )}

    </Wrap>
  );
};

export default Game1;
