import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import GameInfoModal from "../../components/modals/GameInfoModal";
import OpenViduSession from "../../components/OpenViduSession";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import gray from "../../assets/icons/gray.png";
import transparentEdgeImage from "../../assets/images/transparent_edges_image.jpg";
import pose1 from "../../assets/images/pose1.jpg";

const PageWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const VideoCanvas = styled.video`
  width: 640px;
  height: 480px;
  border: 1px solid #ccc;
  position: relative;
  transform: scaleX(-1); /* 좌우 반전 */
`;

const OverlayImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 640px;
  height: 480px;
  opacity: 0.5;
`;

const OverlayText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.5rem;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
`;

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 700px;
`;

const PoseListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PoseRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const PoseItem = styled.button`
  width: 80px;
  height: 80px;
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

const PosePreviewModal = styled.div`
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
  z-index: 1000;
`;

const PoseImage = styled.img`
  width: 300px;
  height: auto;
  margin-bottom: 20px;
  cursor: pointer; /* 이미지 클릭 가능하도록 설정 */
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const RedButton = styled.button`
  padding: 10px 20px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ff7875;
  }
`;

const BlueButton = styled.button`
  padding: 10px 20px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #40a9ff;
  }
`;

const DifficultyLabel = styled.div`
  font-size: 1.2rem;
  color: ${(props) =>
    props.level === "상"
      ? "#ff4d4f"
      : props.level === "중"
      ? "#ffec3d"
      : "#52c41a"};
  text-align: center;
  margin-bottom: 5px;
`;

const Game4 = () => {
  // 각 모달 상태 관리
  const [isFollowPoseWelcomeModalOpen, setIsFollowPoseWelcomeModalOpen] =
    useState(true); // 환영 모달 상태
  const [isFollowPoseSelectModalOpen, setIsFollowPoseSelectModalOpen] =
    useState(false); // 포즈 선택 모달 상태
  const [isPoseSystemModalOpen, setIsPoseSystemModalOpen] = useState(false); // 게임 시작 전 모달 상태
  const [isPoseSelectionModalOpen, setIsPoseSelectionModalOpen] =
    useState(false); // 포즈 선택 모달 상태
  const [isPosePreviewModalOpen, setIsPosePreviewModalOpen] = useState(false); // 포즈 미리보기 모달 상태

  // 게임 관련 상태 관리
  const [selectedPose, setSelectedPose] = useState(null); // 선택된 포즈 상태
  const [showOverlay, setShowOverlay] = useState(false); // 오버레이 이미지 표시 상태
  const [showText, setShowText] = useState(false); // 오버레이 텍스트 표시 상태
  const [round, setRound] = useState(1); // 현재 라운드 상태

  // Redux에서 상태를 가져옴
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const localStream = useSelector((state) => state.room.localStream);
  const openViduToken = useSelector((state) => state.auth.openViduToken);
  const userNo = useSelector((state) => state.auth.userNo);

  const videoRef = useRef(null); // 비디오 요소에 대한 참조 생성

  useEffect(() => {
    // 서버로부터 메시지 수신 및 모달 상태 변경
    client.subscribe(`/topic/game/${roomId}`, (message) => {
      const parsedMessage = JSON.parse(message.body);
      const cmd = parsedMessage.commandType;

      if (cmd === "GAME_MODAL_START") {
        // 게임 시작 시 모든 모달을 닫음
        setIsFollowPoseWelcomeModalOpen(false);
        setIsFollowPoseSelectModalOpen(false);
        setIsPoseSystemModalOpen(false);
      }

      console.log("키워드 타입 :", parsedMessage);
    });
  }, [client, roomId]);

  const runPoseNet = async (videoElement) => {
    // PoseNet 모델을 사용해 포즈 추정
    const net = await posenet.load();
    const pose = await net.estimateSinglePose(videoElement, {
      flipHorizontal: false,
      decodingMethod: "single-person",
    });

    console.log("Pose:", pose);

    // 서버로 포즈 결과 전송
    const payload = {
      num: userNo,
      keypoints: pose.keypoints.map((keypoint) => ({
        part: keypoint.part,
        position: keypoint.position,
        score: keypoint.score,
      })),
    };

    console.log("Sending pose result:", payload);
    client.send(`/app/game/${roomId}/pose/result`, {}, JSON.stringify(payload));
  };

  const startGame = () => {
    // 게임 시작 시 선택된 포즈를 서버에 전송
    if (selectedPose !== null) {
      console.log("Starting game with pose:", selectedPose);
      console.log(
        `Data will be sent to: /app/game/${roomId}/pose/${selectedPose}`
      );
    }

    // 모든 모달을 닫음
    setIsPoseSystemModalOpen(false);
    setIsFollowPoseSelectModalOpen(false);
    setIsFollowPoseWelcomeModalOpen(false);
    setIsPoseSelectionModalOpen(false);
    setIsPosePreviewModalOpen(false);

    // 서버에 게임 시작 신호 전송
    client.send(`/app/game/${roomId}/start-modal/FOLLOW_POSE`);

    if (localStream && videoRef.current) {
      // 로컬 스트림을 비디오 요소에 설정
      const videoElement = videoRef.current;
      videoElement.srcObject = localStream.getMediaStream();
      videoElement.onloadedmetadata = () => {
        videoElement.play();
      };

      if (selectedPose !== null) {
        // 오버레이 이미지와 텍스트 표시
        setShowOverlay(true);
        setShowText(true);
        setTimeout(() => {
          setShowText(false);
          setTimeout(() => {
            setShowOverlay(false);
            setTimeout(() => {
              // PoseNet 실행 및 포즈 결과 전송
              runPoseNet(videoElement);
              if (round < 6) {
                setRound((prevRound) => prevRound + 1); // 다음 라운드로 이동
                setIsFollowPoseSelectModalOpen(true); // 포즈 선택 모달 열기
              } else {
                console.log("게임이 종료되었습니다.");
                setIsFollowPoseWelcomeModalOpen(true); // 게임 종료 후 환영 모달 다시 열기
              }
            }, 1000);
          }, 4000);
        }, 2000);
      }
    }
  };

  const openIsFollowPoseSelectModalOpen = () => {
    // 포즈 선택 모달 열기
    setIsFollowPoseWelcomeModalOpen(false);
    setIsFollowPoseSelectModalOpen(true);
  };

  const openIsPoseSystemModalOpen = () => {
    // 포즈 시스템 모달 열기
    setIsFollowPoseSelectModalOpen(false);
    setIsPoseSystemModalOpen(true);
  };

  const openPoseSelectionModal = () => {
    // 포즈 선택 모달 열기
    setIsPoseSelectionModalOpen(true);
  };

  const closePoseSelectionModal = () => {
    // 포즈 선택 모달 닫기
    setIsPoseSelectionModalOpen(false);
  };

  const selectPose = (poseNumber) => {
    // 포즈 선택 및 미리보기 모달 열기
    setSelectedPose(poseNumber);
    closePoseSelectionModal();
    setIsPosePreviewModalOpen(true);
  };

  const confirmPoseSelection = () => {
    // 포즈 미리보기 모달 닫고 포즈 선택 모달 다시 열기
    setIsPosePreviewModalOpen(false);
    setIsFollowPoseSelectModalOpen(true);
  };

  const cancelPoseSelection = () => {
    // 미리보기 모달 닫고 포즈 선택 모달 열기
    setIsPosePreviewModalOpen(false);
    setIsPoseSelectionModalOpen(true);
  };

  const sendPoseSelection = () => {
    // 선택된 포즈를 서버에 전송하고 포즈 시스템 모달 열기
    if (selectedPose !== null) {
      const poseLoad = {
        poseType: selectedPose,
        num: userNo,
      };

      console.log("Sending pose selection:", poseLoad);

      client.send(
        `/app/game/${roomId}/pose/${selectedPose}`,
        {},
        JSON.stringify(poseLoad)
      );

      setIsPoseSystemModalOpen(true);
    }
  };

  const backToSelectModal = () => {
    // 포즈 시스템 모달 닫고 포즈 선택 모달 열기
    setIsPoseSystemModalOpen(false);
    setIsFollowPoseSelectModalOpen(true);
  };

  return (
    <Wrap>
      <h1>ROUND : {round} / 6</h1>
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
                여러분이 따라해야 할 포즈가 <br /> 난이도와 함께 제공됩니다.{" "}
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
          BlueBtnFn={startGame}
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
          <h3>번호를 클릭하시면 포즈를 미리볼 수 있습니다.</h3>
          <PoseListContainer>
            <DifficultyLabel level="상">상</DifficultyLabel>
            <PoseRow>
              {Array.from({ length: 6 }, (_, index) => (
                <PoseItem
                  key={index + 1}
                  selected={selectedPose === index + 1}
                  onClick={() => selectPose(index + 1)}
                >
                  {index + 1}
                </PoseItem>
              ))}
            </PoseRow>
            <DifficultyLabel level="중">중</DifficultyLabel>
            <PoseRow>
              {Array.from({ length: 7 }, (_, index) => (
                <PoseItem
                  key={index + 7}
                  selected={selectedPose === index + 7}
                  onClick={() => selectPose(index + 7)}
                >
                  {index + 7}
                </PoseItem>
              ))}
            </PoseRow>
            <DifficultyLabel level="하">하</DifficultyLabel>
            <PoseRow>
              {Array.from({ length: 7 }, (_, index) => (
                <PoseItem
                  key={index + 14}
                  selected={selectedPose === index + 14}
                  onClick={() => selectPose(index + 14)}
                >
                  {index + 14}
                </PoseItem>
              ))}
            </PoseRow>
          </PoseListContainer>
        </PoseSelectionModal>
      )}
      {isPosePreviewModalOpen && (
        <PosePreviewModal>
          <PoseImage
            src={pose1}
            alt="Pose Preview"
            onClick={confirmPoseSelection} // 이미지 클릭 시 포즈 선택 모달 열기
          />
          <ButtonGroup>
            <RedButton onClick={confirmPoseSelection}>선택</RedButton>
            <BlueButton onClick={cancelPoseSelection}>뒤로 가기</BlueButton>
          </ButtonGroup>
        </PosePreviewModal>
      )}
      <PageWrap>
        <Title>포즈 페이지</Title>
        <div style={{ position: "relative" }}>
          <VideoCanvas ref={videoRef} width="640" height="480" />
          {showOverlay && <OverlayImage src={transparentEdgeImage} />}
          {showText && (
            <OverlayText>
              화면에 나온 선에 맞춰 포즈를 따라해 주세요
            </OverlayText>
          )}
        </div>
        <OpenViduSession token={openViduToken} />
      </PageWrap>
    </Wrap>
  );
};

export default Game4;
