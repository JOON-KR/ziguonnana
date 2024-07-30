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

const Description = styled.p`
  font-size: 25px;
  font-weight: bold;
  color: #54595e;
  margin-bottom: 48px;
  line-height: 1.5;
  white-space: pre-line; /* 줄바꿈을 적용하기 위한 스타일 */
`;

const BtnWrap = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px; /* 버튼 사이 간격 설정 */
`;

const EndIceBreakingModal = ({ onClose, onContinueGame, onViewReport }) => {
  return (
    <BlackBg onClick={onClose}>
      <ModalWrap
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Description>
          아이스 브레이킹이 모두 끝났습니다.{"\n"}미니게임을 더
          진행하시겠습니까?
        </Description>
        <BtnWrap>
          <AquaBtn text="게임 더하기!" BtnFn={onContinueGame} />
          <AquaBtn text="결과 보고서 보기!" BtnFn={onViewReport} />
        </BtnWrap>
      </ModalWrap>
    </BlackBg>
  );
};

export default EndIceBreakingModal;
