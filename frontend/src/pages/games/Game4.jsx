import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import GameInfoModal from "../../components/modals/GameInfoModal";
import OpenViduSession from "../../components/OpenViduSession";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import red from "../../assets/icons/red.png";
import homeIcon from "../../assets/icons/home.png";

// 각 포즈 이미지와 오버레이 이미지를 가져옵니다
import pose1 from "../../assets/images/pose1.png";
import pose2 from "../../assets/images/pose2.png";
import pose3 from "../../assets/images/pose3.png";
import pose4 from "../../assets/images/pose4.png";
import pose5 from "../../assets/images/pose5.png";
import pose6 from "../../assets/images/pose6.png";
import pose7 from "../../assets/images/pose7.png";
import pose8 from "../../assets/images/pose8.png";
import pose9 from "../../assets/images/pose9.png";
import pose10 from "../../assets/images/pose10.png";
import pose11 from "../../assets/images/pose11.png";
import pose12 from "../../assets/images/pose12.png";
import pose13 from "../../assets/images/pose13.png";
import pose14 from "../../assets/images/pose14.png";
import pose15 from "../../assets/images/pose15.png";
import pose16 from "../../assets/images/pose16.png";
import pose17 from "../../assets/images/pose17.png";
import pose18 from "../../assets/images/pose18.png";
import pose19 from "../../assets/images/pose19.png";
import pose20 from "../../assets/images/pose20.png";
import pose21 from "../../assets/images/pose21.png";
import pose22 from "../../assets/images/pose22.png";

import transparentEdgeImage1 from "../../assets/images/poseline1.png";
import transparentEdgeImage2 from "../../assets/images/poseline2.png";
import transparentEdgeImage3 from "../../assets/images/poseline3.png";
import transparentEdgeImage4 from "../../assets/images/poseline4.png";
import transparentEdgeImage5 from "../../assets/images/poseline5.png";
import transparentEdgeImage6 from "../../assets/images/poseline6.png";
import transparentEdgeImage7 from "../../assets/images/poseline7.png";
import transparentEdgeImage8 from "../../assets/images/poseline8.png";
import transparentEdgeImage9 from "../../assets/images/poseline9.png";
import transparentEdgeImage10 from "../../assets/images/poseline10.png";
import transparentEdgeImage11 from "../../assets/images/poseline11.png";
import transparentEdgeImage12 from "../../assets/images/poseline12.png";
import transparentEdgeImage13 from "../../assets/images/poseline13.png";
import transparentEdgeImage14 from "../../assets/images/poseline14.png";
import transparentEdgeImage15 from "../../assets/images/poseline15.png";
import transparentEdgeImage16 from "../../assets/images/poseline16.png";
import transparentEdgeImage17 from "../../assets/images/poseline17.png";
import transparentEdgeImage18 from "../../assets/images/poseline18.png";
import transparentEdgeImage19 from "../../assets/images/poseline19.png";
import transparentEdgeImage20 from "../../assets/images/poseline20.png";
import transparentEdgeImage21 from "../../assets/images/poseline21.png";
import transparentEdgeImage22 from "../../assets/images/poseline22.png";
import { setGame4Finish } from "../../store/resultSlice";

// 스타일 컴포넌트 정의

const PageWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background-color: #f5f5f5; */
`;

const Title = styled.h1`
  margin-top: 20px;
  font-size: 50px;
  color: #ffffff;
`;

const VideoCanvas = styled.video`
  width: 640px;
  height: 480px;
  /* border: 1px solid #ccc; */
  position: relative;
  transform: scaleX(-1);
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
  border-radius: 15px;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100vh; /* 뷰포트 높이에 맞추기 */
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  /* width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; */
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
  background-color: ${(props) => (props.selected ? "#FF6259" : "#e0e0e0")};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #58fff5;
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
  cursor: pointer;
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
  background-color: #7fa3ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #40a9ff;
  }
`;

const EndGameButton = styled.button`
  padding: 10px 20px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 16px;

  &:hover {
    background-color: #ff7875;
  }
`;

const DifficultyLabel = styled.div`
  font-size: 1.2rem;
  color: ${(props) =>
    props.level === "상"
      ? "#ff4d4f"
      : props.level === "중"
      ? "#f3db00"
      : "#52c41a"};
  text-align: center;
  margin-bottom: 5px;
`;

const HomeIcon = styled.img`
  position: absolute;
  top: 30px;
  left: 30px;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const Game4 = () => {
  const [isFollowPoseWelcomeModalOpen, setIsFollowPoseWelcomeModalOpen] =
    useState(true); // 게임 환영 모달 상태
  const [isFollowPoseSelectModalOpen, setIsFollowPoseSelectModalOpen] =
    useState(false); // 포즈 선택 모달 상태
  const [isPoseSystemModalOpen, setIsPoseSystemModalOpen] = useState(false); // 게임 시작 모달 상태
  const [isPoseSelectionModalOpen, setIsPoseSelectionModalOpen] =
    useState(false); // 포즈 선택 리스트 모달 상태
  const [isPosePreviewModalOpen, setIsPosePreviewModalOpen] = useState(false); // 포즈 미리보기 모달 상태

  const [selectedPose, setSelectedPose] = useState(null);
  const [previousPose, setPreviousPose] = useState(null); // 이전 포즈 값을 저장
  const [showOverlay, setShowOverlay] = useState(false); // 오버레이 이미지 상태
  const [showText, setShowText] = useState(false); // 오버레이 텍스트 상태
  const [round, setRound] = useState(1); // 현재 라운드 상태
  const [gameStarted, setGameStarted] = useState(false); // 게임 시작 여부 체크
  const [currentSelectedPose, setCurrentSelectedPose] = useState(null); // 임시 포즈 선택을 위한 상태
  const [roundResult, setRoundResult] = useState("");
  const [roundPercentage, setRoundPercentage] = useState(90);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [bestMember, setBestMember] = useState("");

  const roomId = useSelector((state) => state.room.roomId); // 룸 ID 상태
  const client = useSelector((state) => state.client.stompClient); // STOMP 클라이언트 상태
  const localStream = useSelector((state) => state.room.localStream); // 로컬 스트림 상태
  const openViduToken = useSelector((state) => state.auth.openViduToken); // OpenVidu 토큰 상태
  const userNo = useSelector((state) => state.auth.userNo); // 사용자 번호 상태
  const [countdown, setCountdown] = useState(null); // 카운트다운 상태 추가
  const videoRef = useRef(null); // 비디오 참조
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트
  const dispatch = useDispatch();
  const [showPoseImage, setShowPoseImage] = useState(false); // 포즈 이미지 표시 상태 추가

  const poseImages = [
    pose1,
    pose2,
    pose3,
    pose4,
    pose5,
    pose6,
    pose7,
    pose8,
    pose9,
    pose10,
    pose11,
    pose12,
    pose13,
    pose14,
    pose15,
    pose16,
    pose17,
    pose18,
    pose19,
    pose20,
    pose21,
    pose22,
  ];

  const overlayImages = [
    transparentEdgeImage1,
    transparentEdgeImage2,
    transparentEdgeImage3,
    transparentEdgeImage4,
    transparentEdgeImage5,
    transparentEdgeImage6,
    transparentEdgeImage7,
    transparentEdgeImage8,
    transparentEdgeImage9,
    transparentEdgeImage10,
    transparentEdgeImage11,
    transparentEdgeImage12,
    transparentEdgeImage13,
    transparentEdgeImage14,
    transparentEdgeImage15,
    transparentEdgeImage16,
    transparentEdgeImage17,
    transparentEdgeImage18,
    transparentEdgeImage19,
    transparentEdgeImage20,
    transparentEdgeImage21,
    transparentEdgeImage22,
  ];

  const endGame = () => {
    dispatch(setGame4Finish());
    client.send(`/app/game/${roomId}/pose/end`);
    // navigate("/icebreaking/games"); // 게임 종료 후 페이지 이동
  };

  // 게임 구독 및 메시지 처리
  useEffect(() => {
    dispatch(setGame4Finish());
    console.log("Subscribing to game topic with roomId:", roomId);
    const subscription = client.subscribe(
      `/topic/game/${roomId}`,
      (message) => {
        console.log("Message received from game topic:", message);

        const parsedMessage = JSON.parse(message.body);
        const cmd = parsedMessage.commandType;

        console.log("Parsed command:", cmd);
        console.log(parsedMessage);
        if (parsedMessage.commandType == "POSE_RESULT") {
          console.log(parsedMessage.data[userNo].message, "결과도착했다!!!!!!");
          setRoundResult(parsedMessage.data[userNo].message);
          setRoundPercentage(parsedMessage.data[userNo].percent);
        } else if (cmd === "POSE_TYPE") {
          // POSE_TYPE 메시지를 받으면 selectedPose를 업데이트
          console.log("Received POSE_TYPE command, setting selected pose...");
          const receivedPose = parsedMessage.data; // 서버로부터 받은 포즈 정보
          setSelectedPose(receivedPose);
        } else if (cmd === "GAME_MODAL_START") {
          // GAME_MODAL_START 메시지를 받으면 모든 모달을 닫음
          console.log(
            "Received GAME_MODAL_START command, closing all modals..."
          );
          closeAllModals();
        } else if (parsedMessage.commandType == "POSE_END") {
          setIsGameEnded(true);
          setBestMember(parsedMessage.data.message);
        } else if (parsedMessage.commandType == "POSE_END_TO_GAMES") {
          navigate("/icebreaking/games");
        }

        console.log("Received command:", parsedMessage);
      }
    );

    return () => {
      subscription.unsubscribe(); // 컴포넌트가 언마운트 될 때 구독 해제
    };
  }, [client, roomId]);

  //맵으로 이동
  useEffect(() => {
    if (client && client.connected) {
      const subscription = client.subscribe(
        `/topic/game/${roomId}`,
        (message) => {
          const parsedMessages = JSON.parse(message.body);

          if (parsedMessages.commandType === "NANA_MAP") {
            navigate("/icebreaking/games");
          }
        }
      );
      client.send(`/app/game/${roomId}/art-start`);
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [client, roomId, navigate, dispatch]);

  // selectedPose가 업데이트될 때마다 게임을 시작
  useEffect(() => {
    if (selectedPose !== null && selectedPose !== previousPose) {
      console.log("Starting game with selectedPose:", selectedPose);
      setPreviousPose(selectedPose); // 이전 포즈 값을 업데이트
      startGame();
    }
  }, [selectedPose, previousPose, gameStarted]);

  // PoseNet을 실행하여 비디오 스트림에서 포즈를 인식하는 함수
  const runPoseNet = async (videoElement) => {
    if (videoElement.readyState < 2) {
      console.log("Video element is not ready, waiting...");
      return;
    }

    const net = await posenet.load();
    const pose = await net.estimateSinglePose(videoElement, {
      flipHorizontal: false,
      decodingMethod: "single-person",
    });

    console.log("Pose estimated:", pose);

    const payload = {
      num: userNo,
      keypoints: pose.keypoints.map((keypoint) => ({
        part: keypoint.part,
        position: keypoint.position,
        score: keypoint.score,
      })),
    };

    console.log("Sending pose result to server:", payload);
    client.send(
      `/app/game/${roomId}/pose/${selectedPose}/result`,
      {},
      JSON.stringify(payload)
    );
  };

  // 게임 시작 함수
  const startGame = () => {
    if (selectedPose !== null && !gameStarted) {
      setGameStarted(true); // 게임 시작 플래그 설정

      const poseLoad = {
        poseType: selectedPose,
        num: userNo,
      };

      console.log("Sending pose selection to server:", poseLoad);

      // 구독자들이 게임을 시작하는 시점 (포즈 정보가 서버에 전송됨)
      client.send(`/app/game/${roomId}/pose`, {}, JSON.stringify(poseLoad));

      console.log("Waiting for POSE_TYPE response to start the game...");

      closeAllModals(); // 모든 모달을 닫음

      console.log("localStream (participant):", localStream);
      console.log("videoRef.current (participant):", videoRef.current);

      if (localStream && videoRef.current) {
        const videoElement = videoRef.current;
        videoElement.srcObject = localStream.getMediaStream();

        videoElement.onloadedmetadata = () => {
          console.log("Video metadata loaded, starting video playback.");
          videoElement
            .play()
            .then(() => {
              setShowPoseImage(true); // 포즈 이미지 표시

              // 포즈 이미지가 사라지고 나서 오버레이와 카운트다운 시작
              setTimeout(() => {
                setShowPoseImage(false); // 포즈 이미지 숨김

                setShowOverlay(true);
                setShowText(true);
                // 여기에서 1초 후에 OverlayText를 숨깁니다.
                setTimeout(() => {
                  setShowText(false);
                }, 1000); // 1초 후에 텍스트를 숨깁니다
                // 별도로 5초 동안 카운트다운 표시
                let count = 5;
                setCountdown(count);

                const countdownInterval = setInterval(() => {
                  count -= 1;
                  if (count > 0) {
                    setCountdown(count);
                  } else {
                    clearInterval(countdownInterval);
                    setCountdown(null); // 카운트다운 숨기기
                  }
                }, 1000); // 1초 간격으로 카운트다운

                // 오버레이와 텍스트가 표시된 후 포즈넷 실행
                setTimeout(() => {
                  console.log("Running PoseNet...");
                  runPoseNet(videoElement); // 포즈넷 실행

                  // 포즈넷 실행 후 1.5초 후에 오버레이와 텍스트 제거
                  setTimeout(() => {
                    setShowText(false);
                    setShowOverlay(false);

                    if (round < 3) {
                      setRound((prevRound) => prevRound + 1);
                      setIsFollowPoseSelectModalOpen(true);
                    } else {
                      setTimeout(() => {
                        dispatch(setGame4Finish());
                        // navigate("/icebreaking/games");
                      }, 3000);
                    }
                    setGameStarted(false);
                  }, 3000); // 1.5초 후에 오버레이와 텍스트 제거
                }, 4000); // 오버레이와 텍스트가 표시된 후 1.5초 후에 포즈넷 실행
              }, 800); // 포즈 이미지가 2.2초 동안 표시된 후 오버레이와 카운트다운 시작
            })
            .catch((error) => {
              console.error("Error during video playback:", error);
            });
        };
      }
    }
  };

  // 모든 모달을 닫는 함수
  const closeAllModals = () => {
    setIsFollowPoseWelcomeModalOpen(false);
    setIsFollowPoseSelectModalOpen(false);
    setIsPoseSystemModalOpen(false);
    setIsPoseSelectionModalOpen(false);
    setIsPosePreviewModalOpen(false);
  };

  const openIsFollowPoseSelectModalOpen = () => {
    setIsFollowPoseWelcomeModalOpen(false);
    setIsFollowPoseSelectModalOpen(true);
  };

  const openIsPoseSystemModalOpen = () => {
    setIsFollowPoseSelectModalOpen(false);
    setIsPoseSystemModalOpen(true);
  };

  const openPoseSelectionModal = () => {
    console.log("Opening pose selection modal");
    setIsPoseSelectionModalOpen(true);
  };

  const closePoseSelectionModal = () => {
    console.log("Closing pose selection modal");
    setIsPoseSelectionModalOpen(false);
  };

  const selectPose = (poseNumber) => {
    console.log("Pose selected:", poseNumber);
    setCurrentSelectedPose(poseNumber); // 임시 포즈를 선택 상태에 저장
    closePoseSelectionModal();
    setIsPosePreviewModalOpen(true); // 포즈 미리보기 모달 열기
  };

  const confirmPoseSelection = () => {
    console.log("Pose selection confirmed:", currentSelectedPose);
    setSelectedPose(currentSelectedPose); // 임시 선택된 포즈를 확정
    setIsPosePreviewModalOpen(false);
    setIsFollowPoseSelectModalOpen(true);
  };
  const cancelPoseSelection = () => {
    console.log("Pose selection cancelled");
    setIsPosePreviewModalOpen(false);
    setIsPoseSelectionModalOpen(true);
  };

  const backToSelectModal = () => {
    console.log("Returning to pose selection modal");
    setIsPoseSystemModalOpen(false);
    setIsFollowPoseSelectModalOpen(true);
  };

  return (
    <Wrap>
      <HomeIcon
        src={homeIcon}
        alt="Home"
        onClick={() => {
          client.send(`/app/game/${roomId}/game-select`);
        }}
      />
      {isGameEnded ? (
        <Title>최고의 멤버 : {bestMember}</Title>
      ) : (
        <Title>ROUND : {round} / 3</Title>
      )}
      {/* 게임 환영 모달 */}
      {isFollowPoseWelcomeModalOpen && (
        <GameInfoModal
          planetImg={red}
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
      {/* 포즈 선택 모달 */}
      {isFollowPoseSelectModalOpen && (
        <GameInfoModal
          planetWidth="150px"
          RedBtnText={"포즈 선택"}
          RedBtnFn={openPoseSelectionModal}
          BlueBtnText={"선택 완료"}
          BlueBtnFn={openIsPoseSystemModalOpen} // 게임 시작 모달로 이동
          modalText={
            selectedPose !== null ? (
              <>
                <h1 style={{ fontSize: "50px", marginBottom: "10px" }}>
                  {roundResult}
                </h1>
                <h1 style={{ fontSize: "50px", marginBottom: "10px" }}>
                  {roundPercentage}
                </h1>
                이제 다음 라운드 포즈를 <br />
                <span style={{ color: "#58FFF5" }}>방장</span>이 골라주세요.
              </>
            ) : (
              <>
                난이도별로 제공되는 포즈를 <br />
                <span style={{ color: "#58FFF5" }}>방장</span>이 선택해주세요.{" "}
                <br />
                나머지 팀원들은 <span style={{ color: "#58FFF5" }}>
                  잠시
                </span>{" "}
                기다려주세요.
              </>
            )
          }
        />
      )}
      {/* 게임 시작 모달 */}
      {isPoseSystemModalOpen && (
        <GameInfoModal
          planetWidth="150px"
          RedBtnText={"뒤로 가기"}
          RedBtnFn={backToSelectModal}
          BlueBtnText={"게임 시작"}
          BlueBtnFn={startGame} // startGame 함수 호출
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
            <DifficultyLabel level="하">하</DifficultyLabel>
            <PoseRow>
              {Array.from({ length: 8 }, (_, index) => (
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
              {Array.from({ length: 8 }, (_, index) => (
                <PoseItem
                  key={index + 9}
                  selected={selectedPose === index + 9}
                  onClick={() => selectPose(index + 9)}
                >
                  {index + 9}
                </PoseItem>
              ))}
            </PoseRow>
            <DifficultyLabel level="상">상</DifficultyLabel>
            <PoseRow>
              {Array.from({ length: 6 }, (_, index) => (
                <PoseItem
                  key={index + 17}
                  selected={selectedPose === index + 17}
                  onClick={() => selectPose(index + 17)}
                >
                  {index + 17}
                </PoseItem>
              ))}
            </PoseRow>
          </PoseListContainer>
        </PoseSelectionModal>
      )}

      {/* 포즈 미리보기 모달 */}
      {isPosePreviewModalOpen && (
        <PosePreviewModal>
          <PoseImage
            src={poseImages[currentSelectedPose - 1]} // currentSelectedPose에 따라 이미지 로드
            alt={`Pose Preview ${currentSelectedPose}`} // alt 속성도 currentSelectedPose로 설정
            onClick={confirmPoseSelection}
          />
          <ButtonGroup>
            <RedButton onClick={confirmPoseSelection}>선택</RedButton>
            <BlueButton onClick={cancelPoseSelection}>뒤로 가기</BlueButton>
          </ButtonGroup>
        </PosePreviewModal>
      )}
      <PageWrap>
        {/* <Title>포즈 페이지</Title> */}
        <div style={{ position: "relative" }}>
          <VideoCanvas ref={videoRef} width="640" height="480" />

          {showPoseImage && (
            <img
              src={poseImages[selectedPose - 1]} // 선택된 포즈의 이미지를 표시
              alt={`Pose ${selectedPose}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "640px",
                height: "480px",
              }}
            />
          )}
          {countdown !== null && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "3rem",
                color: "#FF0000",
              }}
            >
              {countdown}
            </div>
          )}
          {showOverlay && (
            <OverlayImage src={overlayImages[selectedPose - 1]} />
          )}

          {showText && (
            <OverlayText>가이드라인에 맞춰 포즈를 따라해 주세요</OverlayText>
          )}
        </div>
        <OpenViduSession token={openViduToken} />
        {isGameEnded && (
          <EndGameButton onClick={endGame}>게임 종료</EndGameButton>
        )}
      </PageWrap>
    </Wrap>
  );
};
export default Game4;
