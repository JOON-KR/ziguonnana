import React from "react";
import styled from "styled-components";

import GameModalImage from "../../assets/images/gameModal.png";
import RedBtn from "../common/RedBtn";
import BlueBtn from "../common/BlueBtn";

const BlackBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
  background: rgba(0, 0, 0, 0.6);
`;

const ModalWrap = styled.div`
  background-image: url(${GameModalImage});
  background-size: cover;
  background-position: center;
  width: 735px;
  height: 721px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 100px;
  text-align: center;
  box-sizing: border-box;
  padding-top: 40px;
`;

const Planet = styled.img`
  width: 170px;
  height: 148px;
  /* margin-bottom: 20px; */
  display: block;
`;

const GameInfo = styled.h2`
  font-size: 28px;
  margin-top: 20px;
  margin-bottom: 20px;
  line-height: 150%;
`;

const BtnWrap = styled.div`
  margin-top: 50px;
  display: flex;
  gap: 51px;
`;

const GameInfoModal = ({
  onClose,
  modalText,
  planetImg,
  RedBtnText,
  BlueBtnText,
  RedBtnFn,
  BlueBtnFn,
  planetWidth,
}) => {
  return (
    <BlackBg onClick={onClose}>
      <ModalWrap
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {planetImg && <Planet src={planetImg} style={{width: planetWidth}} />}
        <GameInfo>{modalText}</GameInfo>
        <BtnWrap>
          {RedBtnText && <RedBtn text={RedBtnText} BtnFn={RedBtnFn} />}
          <BlueBtn text={BlueBtnText} BtnFn={BlueBtnFn} />
        </BtnWrap>
      </ModalWrap>
    </BlackBg>
  );
};

export default GameInfoModal;
