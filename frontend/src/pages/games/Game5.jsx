import React, { useState } from "react";
import GameInfoModal from "../../components/common/GameInfoModal";
import styled from "styled-components";
import earth from "../../assets/icons/earth.png";
import { Link } from "react-router-dom";

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Game5 = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <Wrap>
      {isModalOpen && (
        <GameInfoModal
          planetImg={earth}
          RedBtnText={"게임 시작"}
          RedBtnFn={""}
          BlueBtnText={"게임 설명"}
          BlueBtnFn={""}
          modalText={"게임3임~~~"}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      Game5
      {/* <Link to={"/icebreaking/games/gameRecord"}>게임 기록</Link> */}
    </Wrap>
  );
};

export default Game5;
