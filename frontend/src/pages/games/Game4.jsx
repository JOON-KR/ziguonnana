import React, { useEffect, useState, useRef } from "react"; // React와 관련된 훅과 기능을 불러옴
import styled from "styled-components"; // styled-components 라이브러리로 컴포넌트 스타일링
import { useSelector } from "react-redux"; // Redux 상태 관리를 위해 useSelector 훅 사용
import GameInfoModal from "../../components/modals/GameInfoModal"; // 게임 정보 모달 컴포넌트 임포트
import OpenViduSession from "../../components/OpenViduSession"; // OpenVidu 세션 컴포넌트 임포트
import * as posenet from "@tensorflow-models/posenet"; // PoseNet 모델 임포트
import "@tensorflow/tfjs"; // TensorFlow.js 임포트
import gray from "../../assets/icons/gray.png"; // 이미지 임포트
import transparentEdgeImage from "../../assets/images/transparent_edges_image.jpg"; // 투명 이미지 임포트
import pose1 from "../../assets/images/pose1.jpg"; // 포즈 이미지 임포트

// 페이지 전체를 감싸는 styled-component
const PageWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

// 페이지 제목 스타일링
const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

// 비디오 캔버스 스타일링, 좌우 반전 효과 적용
const VideoCanvas = styled.video`
  width: 640px;
  height: 480px;
  border: 1px solid #ccc;
  position: relative;
  transform: scaleX(-1); /* 좌우 반전 */
`;

// 오버레이 이미지 스타일링
const OverlayImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 640px;
  height: 480px;
  opacity: 0.5;
`;

// 오버레이 텍스트 스타일링
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

// 전체 콘텐츠를 감싸는 styled-component
const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// 포즈 선택 모달 스타일링, 모달 크기와 위치 조정
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
  width: 700px; /* 모달 크기 증가 */
`;

// 포즈 리스트를 담는 컨테이너 스타일링
const PoseListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// 포즈 버튼들이 한 줄에 배치되는 스타일링
const PoseRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center; /* 포즈 버튼들이 중앙에 정렬되도록 설정 */
`;

// 개별 포즈 버튼 스타일링
const PoseItem = styled.button`
  width: 80px; /* 버튼 크기 증가 */
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

// 포즈 미리보기 모달 스타일링
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

// 포즈 이미지를 담는 컴포넌트 스타일링
const PoseImage = styled.img`
  width: 300px;
  height: auto;
  margin-bottom: 20px;
`;

// 버튼 그룹을 담는 컨테이너 스타일링
const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

// 빨간색 버튼 스타일링
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

// 파란색 버튼 스타일링
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

// 난이도 레이블을 담는 컴포넌트 스타일링
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
  // useState를 사용해 상태를 관리
  const [isFollowPoseWelcomeModalOpen, setIsFollowPoseWelcomeModalOpen] =
    useState(true); // 게임 시작 시 보여줄 모달 상태 관리
  const [isFollowPoseSelectModalOpen, setIsFollowPoseSelectModalOpen] =
    useState(false); // 포즈 선택 모달 상태 관리
  const [isPoseSystemModalOpen, setIsPoseSystemModalOpen] = useState(false); // 포즈 시스템 모달 상태 관리
  const [isPoseDrawingModalOpen, setIsPoseDrawingModalOpen] = useState(false); // 포즈 드로잉 모달 상태 관리
  const [isPoseSelectionModalOpen, setIsPoseSelectionModalOpen] =
    useState(false); // 포즈 선택 모달 상태 관리
  const [isPosePreviewModalOpen, setIsPosePreviewModalOpen] = useState(false); // 포즈 미리보기 모달 상태 관리
  const [selectedPose, setSelectedPose] = useState(null); // 선택한 포즈 상태 관리
  const [showOverlay, setShowOverlay] = useState(false); // 오버레이 이미지 상태 관리
  const [showText, setShowText] = useState(false); // 오버레이 텍스트 상태 관리
  const [round, setRound] = useState(1); // 현재 라운드 상태 관리

  // Redux에서 필요한 상태 가져오기
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const localStream = useSelector((state) => state.room.localStream);
  const openViduToken = useSelector((state) => state.auth.openViduToken);
  const userNo = useSelector((state) => state.auth.userNo);

  // video와 canvas의 ref 생성
  const videoRef = useRef(null);

  // 서버로부터의 메시지 구독
  useEffect(() => {
    client.subscribe(`/topic/game/${roomId}`, (message) => {
      const parsedMessage = JSON.parse(message.body);
      const cmd = parsedMessage.commandType;

      if (cmd === "GAME_MODAL_START") {
        setIsFollowPoseWelcomeModalOpen(false);
        setIsFollowPoseSelectModalOpen(false);
        setIsPoseSystemModalOpen(false);
        setIsPoseDrawingModalOpen(false);
      }

      console.log("키워드 타입 :", parsedMessage);
    });
  }, [client, roomId]);

  // PoseNet 모델을 사용해 포즈를 추정하고 서버로 전송하는 함수
  const runPoseNet = async (videoElement) => {
    const net = await posenet.load();
    const pose = await net.estimateSinglePose(videoElement, {
      flipHorizontal: false,
      decodingMethod: "single-person",
    });

    console.log("Pose:", pose);

    const payload = {
      num: userNo,
      keypoints: pose.keypoints.map((keypoint) => ({
        part: keypoint.part,
        position: keypoint.position,
        score: keypoint.score,
      })),
    };

    console.log("Sending pose result:", payload);
    client.send(
      `/ws/app/game/${roomId}/pose/result`,
      {},
      JSON.stringify(payload)
    );
  };

  // 게임 시작 함수
  const startGame = () => {
    client.send(`/app/game/${roomId}/start-modal/FOLLOW_POSE`);

    if (localStream && videoRef.current) {
      const videoElement = videoRef.current;
      videoElement.srcObject = localStream.getMediaStream();
      videoElement.onloadedmetadata = () => {
        videoElement.play();
      };

      if (selectedPose !== null) {
        setShowOverlay(true);
        setShowText(true);
        setTimeout(() => {
          setShowText(false);
          setTimeout(() => {
            setShowOverlay(false);
            setTimeout(() => {
              runPoseNet(videoElement);
              if (round < 6) {
                setRound((prevRound) => prevRound + 1);
                setIsPoseSystemModalOpen(false); // 현재 모달 닫기
                setIsFollowPoseSelectModalOpen(true); // 다음 라운드로 넘어가며 포즈 선택 모달 열기
              } else {
                console.log("게임이 종료되었습니다.");
              }
            }, 1000);
          }, 4000);
        }, 2000);
      }
    }
  };

  // 모달창을 여는 함수들
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

  // 포즈 선택 후 서버로 전송
  const selectPose = (poseNumber) => {
    setSelectedPose(poseNumber);
    closePoseSelectionModal();
    setIsPosePreviewModalOpen(true); // 포즈 미리보기 모달을 열어줌
  };

  const confirmPoseSelection = () => {
    setIsPosePreviewModalOpen(false);
    setIsPoseSystemModalOpen(true);
  };

  const cancelPoseSelection = () => {
    setIsPosePreviewModalOpen(false);
    setIsPoseSelectionModalOpen(true);
  };

  const sendPoseSelection = () => {
    if (selectedPose !== null) {
      const poseLoad = {
        number: selectedPose,
        num: userNo,
      };

      console.log("Sending pose selection:", poseLoad);

      client.send(
        `/ws/app/game/${roomId}/pose/number`,
        {},
        JSON.stringify(poseLoad)
      );

      setIsPoseSystemModalOpen(true);
    }
  };

  const backToSelectModal = () => {
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
          <PoseImage src={pose1} alt="Pose Preview" />
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
