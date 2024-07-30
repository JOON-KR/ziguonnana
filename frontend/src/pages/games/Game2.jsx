import React, { useState } from "react";
import GameInfoModal from "../../components/modals/GameInfoModal";
import styled from "styled-components";
import orange from "../../assets/icons/orange.png";

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Game2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <Wrap>
      {isModalOpen && (
        <GameInfoModal
          planetImg={orange}
          RedBtnText={"게임 시작"}
          RedBtnFn={""}
          BlueBtnText={"게임 설명"}
          BlueBtnFn={""}
          modalText={"게임2임~~~"}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      Game2
    </Wrap>
  );
};

export default Game2;
