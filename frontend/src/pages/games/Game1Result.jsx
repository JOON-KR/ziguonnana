import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import IntroductionGuideModal from "../../components/modals/IntroductionGuideModal";
import IntroductionModal from "../../components/modals/IntroductionModal";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Centering content with equal space around */
  align-items: center;
  width: 100%;
  height: 100vh;  /* Use entire viewport height */
  padding: 20px; /* Add padding if needed */
  box-sizing: border-box;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 20px;
  flex-wrap: wrap;
`;

const NicknameList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NicknameItem = styled.li`
  font-size: 30px;
  font-weight: bold;
  margin: 10px 0;
`;

const Game1Result = () => {
  const [isIntroGuideModalOpen, setIsIntroGuideModalOpen] = useState(true);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const [cmdType, setCmdType] = useState("");

  const nicknameList = useSelector((state) => state.nickname.nicknameList);
  const userNo = useSelector((state) => state.auth.userNo);
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const maxNo = useSelector((state) => state.room.maxNo);

  const navigate = useNavigate();

  // 현재 사용자의 별명만 필터링
  const userNickname = nicknameList.find(
    (nicknameItem) => nicknameItem.num === userNo
  )?.nickname;

  const handleIntroGuideConfirm = () => {
    setIsIntroGuideModalOpen(false);
    setIsIntroModalOpen(true);
  };

  const handleIntroModalConfirm = () => {
    setIsIntroModalOpen(false);
    navigate("/icebreaking/games/game1");
  };

  useEffect(() => {
    client.subscribe(`/topic/game/${roomId}`, (message) => {
      const parsedMessage = JSON.parse(message.body);

      const cmd = parsedMessage.commandType;

      if (cmd == "GAME_MODAL_START") {
        navigate("/icebreaking/games/game1");
      }

      console.log("키워드 타입 :", parsedMessage);
    });
  }, [client, roomId]);

  return (
    <Wrap>
      {/* {isIntroGuideModalOpen && (
        <IntroductionGuideModal
          onClose={() => setIsIntroGuideModalOpen(false)}
          onConfirm={handleIntroGuideConfirm}
        />
      )}
      {isIntroModalOpen && (
        <IntroductionModal
          onClose={() => setIsIntroModalOpen(false)}
          onConfirm={handleIntroModalConfirm}
        />
      )} */}
      <h2>당신의 별명은</h2>
      <NicknameList>
        <NicknameItem>{userNickname}</NicknameItem>
      </NicknameList>
      <h2>입니다.</h2>
      <ButtonWrap>
        {/* 다음 누르면 game1로감 */}
        <button
          onClick={() => {
            client.send(`/app/game/${roomId}/start-modal/BODY_TALK`); //몸으로 말해요는 아니지만 아무거나 써도됨
          }}
        >
          다음
        </button>
      </ButtonWrap>
    </Wrap>
  );
};

export default Game1Result;
