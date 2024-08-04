import React, { useState } from "react";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import styled from "styled-components";
import red from "../../assets/icons/red.png";
import honaldu from "../../assets/images/igudong_ex_img.png";

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// 이구동성 페이지 (Igudongseong)
const Game3 = () => {
  const [isIgudongseongWelcomeModalOpen, setIsIgudongseongWelcomeModalOpen] = useState(true);
  const [isIgudongseongGuideModalOpen, setIsIgudongseongGuideModalOpen] = useState(false);

  // isIgudongseongWelcomeModalOpen 닫고 isIgudongseongGuideModalOpen 열기
  const openisIgudongseongGuideModalOpen = () => {
    setIsIgudongseongWelcomeModalOpen(false);
    setIsIgudongseongGuideModalOpen(true);
  }

  const closeIgudongseongGuideModal = () => {
    setIsIgudongseongGuideModalOpen(false);
  }

  return (
    <Wrap>
      {isIgudongseongWelcomeModalOpen && (
        <GameInfoModal
          planetImg={red}
          planetWidth='150px'
          RedBtnText={"게임 시작"}
          RedBtnFn={closeIgudongseongGuideModal}
          BlueBtnText={"게임 설명"}
          BlueBtnFn={openisIgudongseongGuideModalOpen}
          modalText={"이구동성 게임에 오신걸 환영합니다 !"}
          onClose={() => setIsIgudongseongWelcomeModalOpen(false)}
        />
      )}
      {isIgudongseongGuideModalOpen && (
        <GameModal
          exImg={honaldu}
          RedBtnText={"게임 시작"}
          RedBtnFn={closeIgudongseongGuideModal}
          modalText={(
            <>
            EX) 호날두 <br /> 제시어가 주어지면, <br /> 위의 예처럼 포즈를 취해주세요.
            </>
          )}          
          onClose={() => setIsIgudongseongGuideModalOpen(false)}
        />
      )}

      이구동성 게임 화면
      </Wrap>
  );
};

export default Game3;
