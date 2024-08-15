import React from "react";
import styled from "styled-components";
import SpeechBubble from "../speechBubble/SpeechBubble";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ModalButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;
const NicknameResultModal = ({ nickname, onClose }) => {
  return (
    <ModalBackground>
      <ModalContent>
        {/* 말풍선에 별명 결과 */}
        <SpeechBubble >
          <h2>당신의 별명은</h2>
          <h1>{nickname}</h1>
        </SpeechBubble>
        <ModalButton onClick={onClose}>닫기</ModalButton>
      </ModalContent>
    </ModalBackground>
  );
};

export default NicknameResultModal;
