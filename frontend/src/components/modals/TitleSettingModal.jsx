import React, { useState } from "react";
import styled from "styled-components";

// 모달 카드 스타일 컴포넌트
const ModalCard = styled.div`
  width: 400px;
  height: 200px;
  background-color: white;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1002; /* overlay보다 위에 위치 */
  margin-left: 10px;
`;

// 닫기 버튼 스타일 컴포넌트
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

// 제목 입력 인풋 스타일 컴포넌트
const TitleInput = styled.input`
  width: 80%;
  height: 40px;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 18px;
`;

// 저장 버튼 스타일 컴포넌트
const SaveButton = styled.button`
  width: 80%;
  height: 40px;
  background-color: #58fff5;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
`;

const TitleSettingModal = ({ onClose }) => {
  const [title, setTitle] = useState("");

  const handleSave = () => {
    // 제목 저장 로직
    onClose();
  };

  return (
    <ModalCard onClick={(e) => e.stopPropagation()}>
      <CloseButton onClick={onClose}>×</CloseButton>
      <TitleInput
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <SaveButton onClick={handleSave}>업로드</SaveButton>
    </ModalCard>
  );
};

export default TitleSettingModal;
