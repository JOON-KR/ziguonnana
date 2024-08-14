import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import IntroductionGuideModal from "../../components/modals/IntroductionGuideModal";
import IntroductionModal from "../../components/modals/IntroductionModal";
import btnIcon from "../../assets/icons/aqua_btn.png";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; /* 화면 중앙에 수직으로 정렬 */
  align-items: center;
  width: 100%;
  height: 100vh; /* 전체 뷰포트 높이를 사용 */
  padding: 20px; /* 필요한 경우 패딩 추가 */
  box-sizing: border-box;
`;

const NicknameWrap = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Nickname = styled.h1`
  font-size: 40px;
  font-weight: bold;
  margin: 20px 0;
  color: #58fff5;
`;

const Text = styled.h1`
  font-size: 25px;
  font-weight: bold;
  margin: 22px 0;
`;

const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 10px;
  cursor: pointer;
`;

const ButtonText = styled.span`
  position: absolute;
  top: 46%;
  left: 52%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 19px;
  font-weight: bold;
  pointer-events: none; /* 버튼 텍스트가 클릭되지 않도록 설정 */
  margin-bottom: 20px;
`;

const IconImage = styled.img`
  height: 45px;
  margin: 8px;
`;

const Game1Result = () => {
  const [isIntroGuideModalOpen, setIsIntroGuideModalOpen] = useState(true);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);

  const nicknameList = useSelector((state) => state.nickname.nicknameList);
  const userNo = useSelector((state) => state.auth.userNo);
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
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
      <NicknameWrap>
        <Text>당신의 별명은</Text>
        <Nickname>{userNickname}</Nickname>
        <Text>입니다.</Text>
      </NicknameWrap>
      <ButtonContainer
        onClick={() => {
          client.send(`/app/game/${roomId}/start-modal/BODY_TALK`);
        }}
      >
        <ButtonText>다음</ButtonText>
        <IconImage src={btnIcon} alt="nextBtn" />
      </ButtonContainer>
    </Wrap>
  );
};

export default Game1Result;
