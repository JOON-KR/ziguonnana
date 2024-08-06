import React from "react";
import styled from "styled-components";
import SpeechBubble from "../../components/speechBubble/SpeechBubble";
import Nana from "../../assets/icons/nana.png";

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  padding-top: 20px; /* 상단 패딩 추가 */
`;

const BubbleWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const StyleButton = styled.button`
  padding: 16px 32px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background-color: #58FFF5;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #1DADA4;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #ff4500;
    transform: translateY(0);
  }
`;

const NanaImg = styled.img`
  width: 300px;
  height: auto;
  margin-top: 20px; /* 상단 마진 조정 */
  margin-bottom: 20px;
`;

const Game1Nickname = ({ onSelectStyle, onClose }) => {
  const styles = ["중세", "조선", "동물", "미래"];
  const text = "별명 스타일을 선택하세요";

  return (
    <Wrap>
      <BubbleWrap>
        <SpeechBubble text={text} />
      </BubbleWrap>
      <NanaImg src={Nana} />
      <ButtonWrap>
        {styles.map((style) => (
          <StyleButton key={style} onClick={() => onSelectStyle(style)}>
            {style}
          </StyleButton>
        ))}
      </ButtonWrap>
    </Wrap>
  );
};

export default Game1Nickname;
