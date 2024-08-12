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
`;

const ModalWrap = styled(FlexCenter)`
  background-image: url(${ClearModal});
  background-size: cover;
  background-position: center;
  width: 721px;
  height: 610px;
  flex-direction: column;
  padding: 40px 20px;
  text-align: center;
  box-sizing: border-box;
`;

const Title = styled.h2`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 48px;
  color: #54595e;
`;


const BtnWrap = styled(FlexCenter)`
  margin-top: 20px;
  width: 100%;
  display: flex;
  gap: 10px;
`;


const GameEndModal = ({
  onClose,
  AquaBtnFn,
}) => {

  const navigate = useNavigate();

  const handlenext = () => {
    navigate("/icebreaking/games/gameRecord");
  }

  return (
    <BlackBg onClick={onClose}>
      <ModalWrap
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Title>마음 속의 얼음을 모두 녹인 여러분, <br /> 축하드립니다.</Title>
        <BtnWrap>
          <AquaBtn text="결과 페이지" BtnFn={onClose} onClick={handlenext}/>
        </BtnWrap>
        
      </ModalWrap>
    </BlackBg>
  );
};

export default GameEndModal;
