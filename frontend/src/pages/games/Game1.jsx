import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import IntroductionGuideModal from "../../components/modals/IntroductionGuideModal";
import IntroductionModal from "../../components/modals/IntroductionModal";
import blue from "../../assets/icons/blue.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setDrawingData } from "../../store/drawingSlice";
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
  const [isDrawingWelcomeModalOpen, setIsDrawingWelcomeModalOpen] =
    useState(false); // DrawingWelcomeModal 상태
  const [isDrawingGuideModalOpen, setIsDrawingGuideModalOpen] = useState(false); // DrawingGuideModal 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let startable = false;

  useEffect(() => {
    console.log("--------------------------------");
    console.log("연결 상태 : ", client.connected);
    console.log("--------------------------------");
    if (client && client.connected) {
      const subscription = client.subscribe(
        `/topic/game/${roomId}`,
        (message) => {
          const parsedMessage = JSON.parse(message.body);

          console.log(startable);
          // console.log("게임 종류 선택 메시지:", parsedMessage);

          // {
          //   "message": "SUCCESS",
          //   "commandType": "ART_START",
          //   "data": true
          // }

          // {
          //   "message": "SUCCESS",
          //   "commandType": "GAME_MODAL_START",
          //   "data": "SAME_POSE"
          // }

          console.log("소켓에서 받은 메시지  ", parsedMessage);

          if (parsedMessage.commandType == "ART_START") {
            startable = true;
            console.log("스타터블 트루됨!!!!!!!!!!!!");
          }

          if (parsedMessage.data == "SAME_POSE" && startable) {
            console.log("3=============");
            setIsDrawingWelcomeModalOpen(false);
            setIsDrawingGuideModalOpen(false);
            setIsIntroGuideModalOpen(false);
            setIsIntroModalOpen(false);
          } else if (parsedMessage.commandType == "GAME_MODAL_START") {
            // setIsIntroGuideModalOpen(false);
            openIntroModal();
          }
          // if (parsedMessage.message.trim() === "이어그리기 첫 키워드 전파") {
          //   // 데이터 받아와서 Redux 상태 업데이트
          //   dispatch(setDrawingData(data));
          //   // art 데이터 캔버스에 그리기
          //   navigate(`/icebreaking/games/game1Drawing`); // Game1Drawing 페이지로 이동
          //   //모달 닫기
          //   setIsDrawingWelcomeModalOpen(false);
          //   setIsDrawingGuideModalOpen(false);
          // }
        }
      );
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [client, roomId]);

  // IntroductionGuideModal 닫고 IntroductionModal 열기
  const openIntroModal = () => {
    console.log("Opening Introduction Modal");
    setIsIntroGuideModalOpen(false);
    setIsIntroModalOpen(true);
  };

  const closeIntroGuideModal = () => {
    console.log("Closing Introduction Guide Modal");
    setIsIntroGuideModalOpen(false);
  };

  const closeIntroModal = () => {
    console.log("Closing Introduction Modal");
    setIsIntroModalOpen(false);
    setIsDrawingWelcomeModalOpen(true); // 자기소개 종료 후 DrawingWelcomeModal 열기
  };

  const openDrawingWelcomeModal = () => {
    console.log("Opening Drawing Welcome Modal");
    setIsIntroModalOpen(false);
    setIsDrawingWelcomeModalOpen(true);
  };

  const closeDrawingWelcomeModal = () => {
    console.log("Closing Drawing Welcome Modal");
    setIsDrawingWelcomeModalOpen(false);
  };

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
      {error && <div style={{ color: "red" }}>{error}</div>}{" "}
      {/* 에러 메시지 표시 */}
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
              제한시간은 20초입니다. <br /> 잠시만 기다려주세요.
            </>
          }
          // onClose={closeDrawingGuideModal}
        />
      )}
      {/* 이어그리기 화면 이동 <= 수정수정 필요 : 응답데이터 오고 3초 후 Game1Drawing open */}
      {!isIntroGuideModalOpen &&
        !isIntroModalOpen &&
        !isDrawingWelcomeModalOpen &&
        !isDrawingGuideModalOpen && <Game1Drawing roomId={roomId} />}
      {/* 결과화면 재생이 끝난 후 버튼 표시 */}
      <button onClick={() => navigate("/icebreaking/games/game1Avata")}>
        버튼
      </button>
    </Wrap>
  );
};

export default Game1;
