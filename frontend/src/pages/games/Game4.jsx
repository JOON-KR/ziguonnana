import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import GameInfoModal from "../../components/modals/GameInfoModal";
import gray from "../../assets/icons/gray.png";
import { useSelector } from "react-redux";

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const VideoContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Video = styled.video`
  width: 80%;
  height: auto;
  border: 2px solid black;
  border-radius: 10px;
`;

const OverlayText = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 16px;
`;

const PoseSelectionModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* Ensure modal is in front */
`;

const PoseList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
`;

const PoseItem = styled.button`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.selected ? "#007bff" : "#e0e0e0")};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const BlueButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Game4 = () => {
  const [isFollowPoseWelcomeModalOpen, setIsFollowPoseWelcomeModalOpen] =
    useState(true);
  const [isFollowPoseSelectModalOpen, setIsFollowPoseSelectModalOpen] =
    useState(false);
  const [isPoseSystemModalOpen, setIsPoseSystemModalOpen] = useState(false);
  const [isPoseSelectionModalOpen, setIsPoseSelectionModalOpen] =
    useState(false);
  const [selectedPose, setSelectedPose] = useState(null);
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const userNo = useSelector((state) => state.auth.userNo);
  const localVideoRef = useRef(null);

  useEffect(() => {
    client.subscribe(`/topic/game/${roomId}`, (message) => {
      const parsedMessage = JSON.parse(message.body);
      const cmd = parsedMessage.commandType;

      if (cmd === "GAME_MODAL_START") {
        setIsFollowPoseWelcomeModalOpen(false);
        setIsFollowPoseSelectModalOpen(false);
        setIsPoseSystemModalOpen(false);
      }

      console.log("키워드 타입 :", parsedMessage);
    });

    // Get user media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });
  }, [client, roomId]);

  const openIsFollowPoseSelectModalOpen = () => {
    setIsFollowPoseWelcomeModalOpen(false);
    setIsFollowPoseSelectModalOpen(true);
  };

  const openIsPoseSystemModalOpen = () => {
    setIsFollowPoseSelectModalOpen(false);
    setIsPoseSystemModalOpen(true);
  };

  const openPoseSelectionModal = () => {
    setIsPoseSelectionModalOpen(true);
  };

  const closePoseSelectionModal = () => {
    setIsPoseSelectionModalOpen(false);
  };

  const selectPose = (poseNumber) => {
    setSelectedPose(poseNumber);
    closePoseSelectionModal();
  };

  const sendPoseSelection = () => {
    if (selectedPose !== null) {
      client.send(
        `/app/game/${roomId}/pose/number`,
        {},
        JSON.stringify({ number: selectedPose })
      );
      setIsPoseSystemModalOpen(true); // 다음 모달로 이동
    }
  };

  const backToSelectModal = () => {
    setIsPoseSystemModalOpen(false);
    setIsFollowPoseSelectModalOpen(true);
  };

  return (
    <Wrap>
      {isFollowPoseWelcomeModalOpen && (
        <GameInfoModal
          planetImg={gray}
          planetWidth="150px"
          BlueBtnText={"게임설명 보기"}
          BlueBtnFn={openIsFollowPoseSelectModalOpen}
          modalText={
            <>
              포즈 따라하기 게임에 오신걸 <br /> 환영합니다 !
            </>
          }
        />
      )}
      {isFollowPoseSelectModalOpen && (
        <GameInfoModal
          planetWidth="150px"
          RedBtnText={"포즈 선택"}
          RedBtnFn={openPoseSelectionModal}
          BlueBtnText={"선택 완료"}
          BlueBtnFn={sendPoseSelection}
          modalText={
            selectedPose !== null ? (
              <>
                {selectedPose}번 포즈를 선택하셨습니다. <br />
                이제 선택 완료 버튼을 눌러주세요.
              </>
            ) : (
              <>
                여러분이 따라해야 할 포즈가 <br /> 난이도와 함께 제공합니다.{" "}
                <br />
                방 생성자는 따라할 포즈를 선택하시고 <br />
                가운데 화면에 틀 안에서 나오는 <br /> 포즈를 따라하세요.
              </>
            )
          }
        />
      )}
      {isPoseSystemModalOpen && (
        <GameInfoModal
          planetWidth="150px"
          RedBtnText={"뒤로 가기"}
          RedBtnFn={backToSelectModal}
          BlueBtnText={"게임 시작"}
          BlueBtnFn={() =>
            client.send(`/app/game/${roomId}/start-modal/FOLLOW_POSE`)
          }
          modalText={
            <>
              여러분이 따라해야 할 포즈가 <br /> 제공됩니다. 제공된 포즈에 맞춰{" "}
              <br />
              최대한 유사하게 포즈를 취해주세요.
            </>
          }
        />
      )}
      {isPoseSelectionModalOpen && (
        <PoseSelectionModal>
          <h3>포즈를 선택하세요</h3>
          <PoseList>
            {Array.from({ length: 20 }, (_, index) => (
              <PoseItem
                key={index + 1}
                selected={selectedPose === index + 1}
                onClick={() => selectPose(index + 1)}
              >
                {index + 1}
              </PoseItem>
            ))}
          </PoseList>
        </PoseSelectionModal>
      )}
      <VideoContainer>
        <Video ref={localVideoRef} autoPlay muted />
        <OverlayText>{userNo} 님의 화면입니다</OverlayText>
      </VideoContainer>
    </Wrap>
  );
};

export default Game4;
