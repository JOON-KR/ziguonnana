import React, { useState } from "react";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import styled from "styled-components";
import gray from "../../assets/icons/gray.png";

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// 포즈 따라하기 페이지 (FollowPose)
const Game4 = () => {
  const [isFollowPoseWelcomeModalOpen, setIsFollowPoseWelcomeModalOpen] = useState(true);
  const [isFollowPoseGuideModalOpen, setIsFollowPoseGuideModalOpen] = useState(false);

  // isFollowPoseWelcomeModalOpen 닫고 isFollowPoseGuideModalOpen 열기
  const openisFollowPoseGuideModalOpen = () => {
    setIsFollowPoseWelcomeModalOpen(false);
    setIsFollowPoseGuideModalOpen(true);
  }

  const closeFollowPoseGuideModal = () => {
    setIsFollowPoseGuideModalOpen(false);
  }

  return (
    <Wrap>
      {isFollowPoseWelcomeModalOpen && (
        <GameInfoModal
          planetImg={gray}
          planetWidth='150px'
          RedBtnText={"게임 시작"}
          RedBtnFn={closeFollowPoseGuideModal}
          BlueBtnText={"게임 설명"}
          BlueBtnFn={openisFollowPoseGuideModalOpen}
          modalText={(
            <>
              포즈 따라하기 게임에 오신걸 <br /> 환영합니다 !
            </>
          )}
          onClose={() => setIsFollowPoseWelcomeModalOpen(false)}
        />
      )}
      {isFollowPoseGuideModalOpen && (
        <GameModal
          exImg={''}
          RedBtnText={"게임 시작"}
          RedBtnFn={closeFollowPoseGuideModal}
          modalText={(
            <>
              나나가 제시하는 사진을 따라하세요! <br />
            </>
          )}          
          onClose={() => setIsFollowPoseGuideModalOpen(false)}
        />
      )}

      포즈 따라하기 게임 화면
    </Wrap>
  );
};

export default Game4;
