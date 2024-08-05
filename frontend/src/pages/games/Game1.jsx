import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GameInfoModal from "../../components/modals/GameInfoModal";
import IntroductionGuideModal from "../../components/modals/IntroductionGuideModal";
import IntroductionModal from "../../components/modals/IntroductionModal";
import DrawingModal from "../../components/modals/DrawingModal"; // DrawingModal import 추가
import BigAquaBtn from "../../components/common/BigAquaBtn";
import SpeechBubble from "../../components/speechBubble/SpeechBubble";
import bigNana from "../../assets/images/bigNana.png";

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  text-align: center;
`;

const BoxWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

// 자기소개 문답 페이지
// & 이어그리기 <- 만들어야함
const Game1 = ({ roomId }) => {
  const [isIntroGuideModalOpen, setIsIntroGuideModalOpen] = useState(true); // IntroductionGuideModal 상태
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false); // IntroductionModal 상태
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false); // DrawingModal 상태
  const [memberId, setMemberId] = useState(""); // 현재 사용자 ID 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [statusMessage, setStatusMessage] = useState(""); // 상태 메시지 상태
  const [messages, setMessages] = useState([]); // 메시지 배열 상태
  const [stompClient, setStompClient] = useState(null); // STOMP 클라이언트 상태

  // 웹소켓 연결 설정
  // useEffect(() => {},);

  // IntroductionGuideModal 닫고 IntroductionModal 열기
  const openIntroModal = () => {
    setIsIntroGuideModalOpen(false);
    setIsIntroModalOpen(true);
  };

  // IntroductionGuideModal 닫기
  const closeIntroGuideModal = () => {
    setIsIntroGuideModalOpen(false);
  };

  // IntroductionModal 닫고 DrawingModal 열기
  const openDrawingModal = () => {
    setIsIntroModalOpen(false);
    setIsDrawingModalOpen(true); // IntroductionModal 닫을 때 DrawingModal 열기
  };

  return (
    <Wrap>
      {/* 에러 메시지 표시 */}
      {isIntroGuideModalOpen && (
        <IntroductionGuideModal
          onClose={closeIntroGuideModal}
          onConfirm={openIntroModal}
        />
      )}
      {isIntroModalOpen &&
        memberId && ( // memberId가 설정된 후 모달 열기
          <IntroductionModal
            onClose={openDrawingModal}
            onConfirm={() => setIsDrawingModalOpen(true)} // IntroductionModal에서 DrawingModal 열기
            roomId={roomId}
            memberId={memberId}
          />
        )}
      {isDrawingModalOpen && (
        <DrawingModal onClose={() => setIsDrawingModalOpen(false)} /> // DrawingModal 컴포넌트 추가
      )}

      {/* <div>
        <SpeechBubble text={"별명 스타일 정해."} />
        <img src={bigNana} style={{ marginLeft: "200px" }} />
        <BoxWrap>
          <BigAquaBtn text={"중세"} />
          <BigAquaBtn text={"조선"} />
          <BigAquaBtn text={"동물"} />
          <BigAquaBtn text={"미래"} />
        </BoxWrap>
      </div> */}
    </Wrap>
  );
};

export default Game1;
