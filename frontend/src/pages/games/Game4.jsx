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
  const [isFollowPoseSelectModalOpen, setIsFollowPoseSelectModalOpen] = useState(false);
  const [isPoseSystemModalOpen, setIsPoseSystemModalOpen] = useState(false);
  const [isPoseDrawingModalOpen, setIsPoseDrawingModalOpen] = useState(false);

  // isFollowPoseWelcomeModalOpen 닫고 isFollowPoseSelectModalOpen 열기
  const openIsFollowPoseSelectModalOpen = () => {
    setIsFollowPoseWelcomeModalOpen(false);
    setIsFollowPoseSelectModalOpen(true);
  }
  
  // isFollowPoseSelectModalOpen 닫고 isPoseSystemModalOpen 열기
  const openIsPoseSystemModalOpen = () => {
    setIsFollowPoseSelectModalOpen(false);
    setIsPoseSystemModalOpen(true);
  }
  
  // isFollowPoseSelectModalOpen 닫고 isPoseDrawingModalOpen 열기
  const openIsPoseDrawingModalOpen = () => {
    setIsFollowPoseSelectModalOpen(false);
    setIsPoseDrawingModalOpen(true);
  }
  
  // isPoseSystemModalOpen 닫기
  const closePoseSystemModal = () => {
    setIsPoseSystemModalOpen(false);
  }

  // isPoseSystemModalOpen/isPoseDrawingModalOpen 닫고 isFollowPoseSelectModalOpen 열기
  const backToSelectModal = () => {
    setIsPoseSystemModalOpen(false);
    setIsPoseDrawingModalOpen(false);
    setIsFollowPoseSelectModalOpen(true);
  }

  // isPoseDrawingModalOpen 닫기 
  const closePoseDrawingModal = () => {
    setIsPoseDrawingModalOpen(false);
  }

  return (
    <Wrap>
      {isFollowPoseWelcomeModalOpen && (
        <GameInfoModal
          planetImg={gray}
          planetWidth='150px'
          BlueBtnText={"게임방식 선택"}
          BlueBtnFn={openIsFollowPoseSelectModalOpen}
          modalText={(
            <>
              포즈 따라하기 게임에 오신걸 <br /> 환영합니다 !
            </>
          )}
          onClose={() => setIsFollowPoseWelcomeModalOpen(false)}
        />
      )}
      {isFollowPoseSelectModalOpen && (
        <GameInfoModal
          planetWidth='150px'
          RedBtnText={"시스템 제공 포즈"}
          RedBtnFn={openIsPoseSystemModalOpen}
          BlueBtnText={"직접 그린 포즈"}
          BlueBtnFn={openIsPoseDrawingModalOpen}
          modalText={(
            <>
              포즈를 직접 그려 진행할수도, <br /> 제공된 포즈를 활용하여 <br />
              진행할수도 있습니다. <br /> 원하는 방식을 선택하세요.
            </>
          )}
          onClose={() => setIsFollowPoseSelectModalOpen(false)}
        />
      )}
      {isPoseSystemModalOpen && (
        <GameInfoModal
          planetWidth='150px'
          RedBtnText={"뒤로 가기"}
          RedBtnFn={backToSelectModal}
          BlueBtnText={"게임 시작"}
          BlueBtnFn={closePoseSystemModal}
          modalText={(
            <>
              여러분이 따라해야 할 포즈가 <br /> 제공됩니다. 제공된 포즈에 맞춰 <br />
              최대한 유사하게 포즈를 취해주세요.
            </>
          )}
          onClose={() => setIsPoseSystemModalOpen(false)}
        />
      )}
      {isPoseDrawingModalOpen && (
        <GameInfoModal
          planetWidth='150px'
          RedBtnText={"뒤로 가기"}
          RedBtnFn={backToSelectModal}
          BlueBtnText={"게임 시작"}
          BlueBtnFn={closePoseDrawingModal}
          modalText={(
            <>
              우선, 랜덤 지정된 한 명이 포즈를  <br /> 그리게 됩니다.
              이 포즈에 따라 맞춰  <br /> 최대한 유사하게 포즈를 취해주세요.
            </>
          )}
          onClose={() => setIsPoseDrawingModalOpen(false)}
        />
      )}

      포즈 따라하기 게임 화면
    </Wrap>
  );
};

export default Game4;
