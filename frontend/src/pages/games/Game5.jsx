import React, { useEffect, useState } from "react";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import styled from "styled-components";
import earth from "../../assets/icons/earth.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
  const [isShortFormWelcomeModalOpen, setIsShortFormWelcomeModalOpen] =
    useState(true);
  const [isShortFormDanceGuideModalOpen, setIsShortFormDanceGuideModalOpen] =
    useState(false);
  const [
    isShortFormTeamIntroGuideModalOpen,
    setIsShortFormTeamIntroGuideModalOpen,
  ] = useState(false);

  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);

  const navigate = useNavigate();

  useEffect(() => {
    client.subscribe(`/topic/game/${roomId}`, (message) => {
      const parsedMessage = JSON.parse(message.body);

      const cmd = parsedMessage.commandType;

      if (cmd === "GAME_MODAL_START") {
        setIsShortFormWelcomeModalOpen(false);
        setIsShortFormDanceGuideModalOpen(false);
        setIsShortFormTeamIntroGuideModalOpen(false);
      }

      console.log("키워드 타입 :", parsedMessage);
    });
  }, [client, roomId]);

  // isShortFormWelcomeModalOpen 닫고 댄스 챌린지 설명 모달 열기
  const openisShortFormDanceGuideModalOpen = () => {
    setIsShortFormWelcomeModalOpen(false);
    setIsShortFormDanceGuideModalOpen(true);
  };

  // isShortFormWelcomeModalOpen 닫고 팀 소개 챌린지 설명 모달 열기
  const openisShortFormTeamIntroGuideModalOpen = () => {
    setIsShortFormWelcomeModalOpen(false);
    setIsShortFormTeamIntroGuideModalOpen(true);
  };

  // 댄스 챌린지 설명 모달 닫기 및 페이지 이동
  const closeShortFormDanceGuideModal = () => {
    setIsShortFormDanceGuideModalOpen(false);
    navigate("/icebreaking/games/Game5Dance");
  };

  // 팀 소개 챌린지 설명 모달 닫기 및 페이지 이동
  const closeShortFormTeamIntroGuideModal = () => {
    setIsShortFormTeamIntroGuideModalOpen(false);
    navigate("/icebreaking/games/Game5TeamIntro");
  };

  return (
    <Wrap>
      {isShortFormWelcomeModalOpen && (
        <GameInfoModal
          planetImg={earth}
          planetWidth="180px"
          RedBtnText={"댄스 챌린지"}
          RedBtnFn={openisShortFormDanceGuideModalOpen}
          BlueBtnText={"팀 소개 챌린지"}
          BlueBtnFn={openisShortFormTeamIntroGuideModalOpen}
          modalText={<>숏폼 챌린지에 오신걸 환영합니다 !</>}
        />
      )}
      {isShortFormDanceGuideModalOpen && (
        <GameModal
          exImg={""}
          RedBtnText={"챌린지 시작"}
          // 버튼 누르면, 댄스 챌린지 페이지로 넘어가도록 수정
          RedBtnFn={closeShortFormDanceGuideModal}
          modalText={
            <>
              댄스 챌린지를 선택하셨습니다.
              <br />
              챌린지(EX. 마라탕후루) 영상을
              <br />
              한 가지 선택 후, 릴레이 촬영으로 <br />
              댄스 챌린지 영상을 완성해봅시다!
            </>
          }
        />
      )}
      {isShortFormTeamIntroGuideModalOpen && (
        <GameModal
          exImg={""}
          RedBtnText={"챌린지 시작"}
          // 버튼 누르면, 팀소개 챌린지 페이지로 넘어가도록 수정
          RedBtnFn={closeShortFormTeamIntroGuideModal}
          modalText={
            <>
              팀 소개 챌린지를 선택하셨습니다.
              <br />
              팀원들끼리 간단히 기획 후 <br />
              릴레이 촬영으로 팀 소개 영상을 <br />
              완성해봅시다!
            </>
          }
        />
      )}
      숏폼 챌린지 화면 여기서 x -- 다른 페이지로 이동
      {/* <Link to={"/icebreaking/games/gameRecord"}>게임 기록</Link> */}
    </Wrap>
  );
};

export default Game5;
