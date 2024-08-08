import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import IntroductionGuideModal from "../../components/modals/IntroductionGuideModal";
import IntroductionModal from "../../components/modals/IntroductionModal";
import blue from "../../assets/icons/blue.png";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import Game1Drawing from "./Game1Drawing";

const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

// 자기소개 문답 모달 & 이어그리기 페이지 (Drawing)
const Game1 = () => {
  const [isIntroGuideModalOpen, setIsIntroGuideModalOpen] = useState(true); // IntroductionWelcomeModal 상태
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false); // IntroductionModal 상태
  const [isDrawingWelcomeModalOpen, setIsDrawingWelcomeModalOpen] = useState(false); // DrawingWelcomeModal 상태
  const [isDrawingGuideModalOpen, setIsDrawingGuideModalOpen] = useState(false); // DrawingGuideModal 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("--------------------------------");
    console.log("연결 상태 : ", client.connected);
    console.log("--------------------------------");
    if (client && client.connected) {
      client.subscribe(`/topic/game/${roomId}`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        // console.log("게임 종류 선택 메시지:", parsedMessage);

        const cmd = parsedMessage.commandType;
        const data = parsedMessage.data;

        console.log("닫기 요청 데이터 ", parsedMessage);
        console.log("닫기 요청 데이터 ", data);

        if (data == "SAME_POSE") {
          setIsDrawingWelcomeModalOpen(false);
          setIsDrawingGuideModalOpen(false);
        } else if (cmd == "GAME_MODAL_START") {
          // setIsIntroGuideModalOpen(false);
          openIntroModal();
        }
      });
    }
  }, [client, roomId]);

  // IntroductionGuideModal 닫고 IntroductionModal 열기
  const openIntroModal = () => {
    console.log("Opening Introduction Modal");
    setIsIntroGuideModalOpen(false);
    setIsIntroModalOpen(true);
  };

  // IntroductionGuideModal 닫기
  const closeIntroGuideModal = () => {
    console.log("Closing Introduction Guide Modal");
    setIsIntroGuideModalOpen(false);
  };

  // IntroductionModal 닫기
  const closeIntroModal = () => {
    console.log("Closing Introduction Modal");
    setIsIntroModalOpen(false);
    setIsDrawingWelcomeModalOpen(true); // 자기소개 종료 후 DrawingWelcomeModal 열기
  };

  // IntroductionModal 닫고 DrawingWelcomeModal 열기
  const openDrawingWelcomeModal = () => {
    console.log("Opening Drawing Welcome Modal");
    setIsIntroModalOpen(false);
    setIsDrawingWelcomeModalOpen(true);
  };

  // DrawingWelcomeModal 닫기
  const closeDrawingWelcomeModal = () => {
    console.log("Closing Drawing Welcome Modal");
    setIsDrawingWelcomeModalOpen(false);
  };

  // DrawingGuideModal 닫기
  const closeDrawingGuideModal = () => {
    console.log("Closing Drawing Guide Modal");
    setIsDrawingGuideModalOpen(false);
  };

  // DrawingWelcomeModal 닫고 DrawingGuideModal 열기  
  const openDrawingGuideModal = () => {
    console.log("Opening Drawing Guide Modal");
    setIsDrawingWelcomeModalOpen(false);
    setIsDrawingGuideModalOpen(true);
  };

  return (
    <Wrap>
      {error && <div style={{ color: "red" }}>{error}</div>}{" "} {/* 에러 메시지 표시 */}
      {/* 자기소개 가이드 모달 */}
      {isIntroGuideModalOpen && (
        <IntroductionGuideModal
          // onClose={closeIntroGuideModal}
          onConfirm={() =>
            client.send(`/app/game/${roomId}/start-modal/BODY_TALK`)
          }
        />
      )}
      {/* 자기소개 모달 */}
      {isIntroModalOpen && (
        <IntroductionModal
          onClose={closeIntroModal}
          onConfirm={openDrawingWelcomeModal}
        />
      )}
      {/* 이어그리기 행성 입장 */}
      {isDrawingWelcomeModalOpen && (
        <GameInfoModal
          planetImg={blue}
          RedBtnText={"게임 시작"}
          // {/* 게임시작 버튼 누르면 모달 닫고 페이지에서 진행 */}
          RedBtnFn={() => {
            console.log("닫기 요청");
            client.send(`/app/game/${roomId}/start-modal/SAME_POSE`);
          }}
          BlueBtnText={"게임 설명"}
          BlueBtnFn={() =>
            // client.send(`/app/game/${roomId}/start-modal/SAME_POSE`)
            openDrawingGuideModal()
          }
          modalText={"이어그리기 게임에 오신걸 환영합니다 !"}
          // onClose={closeDrawingWelcomeModal}
        />
      )}
      {isDrawingGuideModalOpen && (
        <GameModal
          RedBtnText={"게임 시작"}
          // {/* 게임시작 버튼 누르면 모달 닫고 페이지에서 진행 */}
          RedBtnFn={() => {
            console.log("닫기 요청");
            client.send(`/app/game/${roomId}/start-modal/SAME_POSE`);
          }}
          modalText={
            <>
              주어지는 이미지와 특징을 바탕으로 <br /> 아바타를 그려주세요.{" "}
              <br />
              제한시간은 20초입니다.
            </>
          }
          // onClose={closeDrawingGuideModal}
        />
      )}

      {/* 이어그리기 화면 이동 */}
      {!isIntroGuideModalOpen && !isIntroModalOpen && !isDrawingWelcomeModalOpen && !isDrawingGuideModalOpen && (
        <Game1Drawing roomId={roomId} />
      )}      
      {/* 결과화면 재생이 끝난 후 버튼 표시 */}
      <button onClick={() => navigate('/icebreaking/games/game1NickName')}>별명짓기</button>
    </Wrap>
  );
};

export default Game1;