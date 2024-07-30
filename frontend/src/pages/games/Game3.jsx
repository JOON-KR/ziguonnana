import React, { useState } from "react";
import GameInfoModal from "../../components/common/GameInfoModal";
import styled from "styled-components";
import red from "../../assets/icons/red.png";

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Game3 = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <Wrap>
      {isModalOpen && (
        <GameInfoModal
          planetImg={red}
          RedBtnText={"게임 시작"}
          RedBtnFn={""}
          BlueBtnText={"게임 설명"}
          BlueBtnFn={""}
          modalText={"게임3임~~~"}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      Game3
    </Wrap>
  );
};

export default Game3;
