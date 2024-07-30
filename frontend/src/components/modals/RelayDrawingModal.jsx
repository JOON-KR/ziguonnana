import React from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import AquaBtn from "../common/AquaBtn";

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
  background-image: url(${GoogleModal});
  background-size: cover;
  background-position: center;
  width: 721px;
  height: 610px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
  box-sizing: border-box;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #54595e;
`;

const Description = styled.p`
  font-size: 27px;
  color: #54595e;
  margin-bottom: 48px;
  line-height: 1.5;
  white-space: pre-line;
`;

const BtnWrap = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px; /* 버튼 사이 간격 설정 */
`;

const RelayDrawingGuideModal = ({ onClose, onConfirm }) => {
  return (
    <BlackBg onClick={onClose}>
      <ModalWrap
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Title>이어그리기 방식을 소개합니다!</Title>
        <Description>
          참가자 1명을 표현하는 {"\n"}이미지와 특징이 주어집니다. {"\n"}특징은
          몇 개의 키워드로 주어집니다.{"\n"}주어지는 정보를 참고하여 아바타를
          그려주세요.{"\n"}
          제한시간은 20초입니다.
          {"\n"}
        </Description>
        <BtnWrap>
          <AquaBtn text="YES!" BtnFn={onConfirm} />
        </BtnWrap>
      </ModalWrap>
    </BlackBg>
  );
};

export default RelayDrawingGuideModal;
