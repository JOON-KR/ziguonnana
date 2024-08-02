import React, { useState } from "react";
import GameInfoModal from "../../components/modals/GameInfoModal";
import blue from "../../assets/icons/blue.png";
import styled from "styled-components";
import IntroductionGuideModal from "../../components/modals/IntroductionGuideModal";
import IntroductionModat from "../../components/modals/IntroductionModal";
// 자기소개 문답 페이지

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
  text-align: center;
`;

const Game1 = () => {
  const [isIntroGuideModalOpen, setIsIntroGuideModalOpen] = useState(true);


  const closeIntroGuideModal = () => {
    setIsIntroGuideModalOpen(false);
  };

  return (
    <Wrap>
      <div>
        Game1
      </div>
      {/* {isIntroGuideModalOpen && (
        <IntroductionGuideModal onClose={closeIntroGuideModal} />
      )} */}


    </Wrap>
  );
};

export default Game1;
