import React, { useState } from "react";
import GameInfoModal from "../../components/common/GameInfoModal";
import styled from "styled-components";
import gray from "../../assets/icons/gray.png";

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Game4 = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <Wrap>
      {isModalOpen && (
        <GameInfoModal
          planetImg={gray}
          RedBtnText={"게임 시작"}
          RedBtnFn={""}
          BlueBtnText={"게임 설명"}
          BlueBtnFn={""}
          modalText={"게임3임~~~"}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      Game4
    </Wrap>
  );
};

export default Game4;
