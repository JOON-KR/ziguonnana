import React, { useState } from "react";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import styled from "styled-components";
import earth from "../../assets/icons/earth.png";
import { Link } from "react-router-dom";

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// 숏폼 챌린지 페이지 (ShortForm)
const Game5 = () => {
  const [isShortFormWelcomeModalOpen, setIsShortFormWelcomeModalOpen] = useState(true);
  const [isShortFormGuideModalOpen, setIsShortFormGuideModalOpen] = useState(false);

  // isShortFormWelcomeModalOpen 닫고 isShortFormGuideModalOpen 열기
  const openisShortFormGuideModalOpen = () => {
    setIsShortFormWelcomeModalOpen(false);
    setIsShortFormGuideModalOpen(true);
  }

  // 가이드 2개 만들기 : 댄스 / 팀소개
  const closeShortFormGuideModal = () => {
    setIsShortFormGuideModalOpen(false);
  }

  return (
    <Wrap>
      {isShortFormWelcomeModalOpen && (
        <GameInfoModal
          planetImg={earth}
          planetWidth='180px'
          RedBtnText={"댄스 챌린지"}
          RedBtnFn={openisShortFormGuideModalOpen}
          BlueBtnText={"팀 소개 챌린지"}
          BlueBtnFn={openisShortFormGuideModalOpen}
          modalText={(
            <>
              숏폼 챌린지에 오신걸 환영합니다 !
            </>
          )}
          onClose={() => setIsShortFormWelcomeModalOpen(false)}
        />
      )}
      {isShortFormGuideModalOpen && (
        <GameModal
          exImg={''}
          RedBtnText={"챌린지 시작"}
          RedBtnFn={closeShortFormGuideModal}
          modalText={(
            <>
              숏폼 챌린지 설명 <br />
            </>
          )}          
          onClose={() => setIsShortFormGuideModalOpen(false)}
        />
      )}

      숏폼 챌린지 화면
      {/* <Link to={"/icebreaking/games/gameRecord"}>게임 기록</Link> */}
    </Wrap>
  );
};

export default Game5;
