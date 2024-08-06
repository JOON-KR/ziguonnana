import React, { useState } from "react";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import styled from "styled-components";
import orange from "../../assets/icons/orange.png";

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// 몸으로 말해요 페이지 (BodyTalk)
const Game2 = () => {
  const [isBodyTalkWelcomeModalOpen, setIsBodyTalkWelcomeModalOpen] = useState(true);
  const [isBodyTalkGuideModalOpen, setIsBodyTalkGuideModalOpen] = useState(false)

  // isBodyTalkWelcomeModalOpen 닫고 isBodyTalkGuideModalOpen 열기
  const openBodyTalkGuideModal = () => {
    setIsBodyTalkWelcomeModalOpen(false);
    setIsBodyTalkGuideModalOpen(true);
  }

  const closeBodyTalkGuideModal = () => {
    setIsBodyTalkGuideModalOpen(false);
  }

  return (
    <Wrap>
      {isBodyTalkWelcomeModalOpen && (
        <GameInfoModal
          planetImg={orange}
          RedBtnText={"게임 시작"}
          // {/* 게임시작 버튼 누르면 모달 닫고 페이지에서 진행 */}      
          RedBtnFn={closeBodyTalkGuideModal}
          BlueBtnText={"게임 설명"}
          BlueBtnFn={openBodyTalkGuideModal}
          modalText={"몸으로말해요 게임에 오신걸 환영합니다 !"}
          onClose={() => setIsBodyTalkWelcomeModalOpen(false)}
        />
      )}
      {isBodyTalkGuideModalOpen && (
        <GameModal
          RedBtnText={"게임 시작"}
          // {/* 게임시작 버튼 누르면 모달 닫고 페이지에서 진행 */}      
          RedBtnFn={closeBodyTalkGuideModal}
          modalText={(
            <>
            한 명은 제시어를 몸으로 표현하고, <br /> 나머지는 제시어를 맞추면 됩니다. <br />
            제한 시간은 4분입니다.
            </>
          )}
          onClose={() => setIsBodyTalkGuideModalOpen(false)}
        />
      )}
      
      몸으로 말해요 게임 화면

    </Wrap>
  );
};

export default Game2;
