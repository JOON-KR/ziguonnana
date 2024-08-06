import React from "react";
import styled from "styled-components";

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
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const NicknameStyleModal = ({ onSelectStyle, onClose }) => {
  const styles = ["중세", "조선", "동물", "미래"];

  return (
    <ModalBackground>
      <ModalContent>
        <h2>별명 스타일을 선택하세요</h2>
        {styles.map((style) => (
          <ModalButton key={style} onClick={() => onSelectStyle(style)}>
            {style}
          </ModalButton>
        ))}
        <ModalButton onClick={onClose}>닫기</ModalButton>
      </ModalContent>
    </ModalBackground>
  );
};

export default NicknameStyleModal;
