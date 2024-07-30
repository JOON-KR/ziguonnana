import React, { useState } from "react";
import GameInfoModal from "../../components/modals/GameInfoModal";
import blue from "../../assets/icons/blue.png";
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
  text-align: center;
`;

const Game1 = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const onClose = () => {
    setIsModalOpen(false);
  };

  return <Wrap>Game1</Wrap>;
};

export default Game1;
