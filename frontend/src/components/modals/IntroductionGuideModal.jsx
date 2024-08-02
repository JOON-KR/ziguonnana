import React from "react";
import styled from "styled-components";
import GoogleModal from "../../assets/images/googleModal.png";
import AquaBtn from "../common/AquaBtn";

// 배경 스타일 컴포넌트
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

// 모달 스타일 컴포넌트
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

// 제목 스타일 컴포넌트
const Title = styled.h2`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 56px;
  color: #54595e;
`;

// 설명 텍스트 스타일 컴포넌트
const Description = styled.p`
  font-size: 25px;
  color: #54595e;
  margin-bottom: 48px;
  line-height: 1.5;
`;

// 버튼 랩퍼 스타일 컴포넌트
const BtnWrap = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px; /* 버튼 사이 간격 설정 */
`;

// 굵은 텍스트 스타일 컴포넌트
const Bold = styled.span`
  font-weight: bold;
`;

// IntroductionGuideModal 컴포넌트 정의
const IntroductionGuideModal = ({ onClose, onConfirm }) => {
  return (
    <BlackBg onClick={onClose}>
      <ModalWrap
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Title>자기소개 방식을 소개합니다!</Title>
        <Description>
          n 개의 질문이 <Bold>랜덤</Bold>으로 주어집니다<div></div> 주어진
          질문에 대해 <Bold>채팅</Bold>으로 답변해주세요. <div></div>
          질문당<Bold>5초</Bold>의 제한 시간이 주어집니다.
        </Description>
        <BtnWrap>
          <AquaBtn text="YES!" BtnFn={onConfirm} />
        </BtnWrap>
      </ModalWrap>
    </BlackBg>
  );
};

export default IntroductionGuideModal;
