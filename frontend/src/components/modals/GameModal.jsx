import React from "react";
import styled from "styled-components";
import GameModalImage from "../../assets/images/gameModal.png";
import RedBtn from "../common/RedBtn";

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

const ExImage = styled.img`
  width: 170px;
  height: 148px;
  display: block;
`;

const GameInfo = styled.h2`
  font-size: 27px;
  line-height: 150%;
  margin: 20px 30px;
`;

const BtnWrap = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 51px;
`;

const GameModal = ({
  onClose,
  modalText,
  RedBtnText,
  RedBtnFn,
  exImg,
}) => {
  return (
    <BlackBg onClick={onClose}>
      <ModalWrap
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {exImg && <ExImage src={exImg} />}
        <GameInfo>{modalText}</GameInfo>
        <BtnWrap>
          <RedBtn text={RedBtnText} BtnFn={RedBtnFn} />
        </BtnWrap>
      </ModalWrap>
    </BlackBg>
  );
};

export default GameModal;
