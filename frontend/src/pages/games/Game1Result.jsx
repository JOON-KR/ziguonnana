import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import IntroductionGuideModal from "../../components/modals/IntroductionGuideModal";
import IntroductionModal from "../../components/modals/IntroductionModal";

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
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
  const nicknameList = useSelector((state) => state.nickname.nicknameList);
  const userNo = useSelector((state) => state.auth.userNo);
  const navigate = useNavigate();

  // 현재 사용자의 별명만 필터링
  const userNickname = nicknameList.find((nicknameItem) => nicknameItem.num === userNo)?.nickname;

  const handleIntroGuideConfirm = () => {
    setIsIntroGuideModalOpen(false);
    setIsIntroModalOpen(true);
  };

  const handleIntroModalConfirm = () => {
    setIsIntroModalOpen(false);
    navigate('/icebreaking/games/game1');
  };

  return (
    <Wrap>
      {isIntroGuideModalOpen && (
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
      )}
      <h2>당신의 별명은</h2>
      <NicknameList>
        <NicknameItem>{userNickname}</NicknameItem>
      </NicknameList>
      <h2>입니다.</h2>
      <ButtonWrap>
        <button onClick={handleIntroModalConfirm}>다음</button>
      </ButtonWrap>
    </Wrap>
  );
};

export default Game1Result;
