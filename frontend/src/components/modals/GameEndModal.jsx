import React, { useState } from "react";
import styled from "styled-components";
import ClearModal from "../../assets/images/clearModal.png";
import AquaBtn from "../../assets/icons/aqua_btn.png";
import EndBg from "../../assets/images/endBg.png";
import { useNavigate } from "react-router-dom";

// 공통 스타일
const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BlackBg = styled(FlexCenter)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  background: rgba(0, 0, 0, 0.6);
  background-image: url(${EndBg});
  background-size: cover; 
  background-position: center; 
`;

const ModalWrap = styled(FlexCenter)`
  background-image: url(${ClearModal});
  background-size: contain; /* 이미지를 줄이면서 비율 유지 */
  background-position: center;
  width: 100%; 
  height: 100%; 
  max-width: 600px;
  max-height: 600px;
  flex-direction: column;
  text-align: center;
  box-sizing: border-box;
`;

const Title = styled.h2`
  font-size: 25px;
  font-weight: bold;
  margin-top: 130px;
  margin-bottom: 30px;
  color: black;
  text-align: center;
`;

const BtnWrap = styled(FlexCenter)`
  margin-top: 20px;
  margin-right: 20px;
  width: 100%;
  display: flex;
  gap: 10px;
  text-align: center;
`;

// AquaBtn 스타일 정의
const StyledButton = styled.button`
  background: url(${AquaBtn}) no-repeat center center;
  background-size: contain;
  width: 150px;
  height: 80px;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #54595E;
  text-align: center;
  font-weight: bold;
`;

const GameEndModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleNext = () => {
    onClose(); // 모달 닫기
    navigate("/icebreaking/games/gameRecord");
  };

  return (
    <BlackBg onClick={onClose}>
      <ModalWrap onClick={(e) => e.stopPropagation()}>
        <Title>
          마음 속의 얼음을 모두 녹인 여러분, <br /> 축하드립니다.
        </Title>
        <BtnWrap>
          <StyledButton onClick={handleNext}>결과 페이지</StyledButton>
        </BtnWrap>
      </ModalWrap>
    </BlackBg>
  );
};

export default GameEndModal;