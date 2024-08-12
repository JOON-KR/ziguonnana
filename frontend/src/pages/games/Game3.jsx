import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import styled from "styled-components";
import SpeechBubble from "../../components/speechBubble/SpeechBubble";
import red from "../../assets/icons/red.png";
import honaldu from "../../assets/images/igudong_ex_img.png";
import bigNana from "../../assets/images/bigNana.png";
import { useSelector } from "react-redux";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import OpenViduSession from "../../components/OpenViduSession";

const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PageWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const VideoCanvas = styled.video`
  width: 640px;
  height: 480px;
  border: 1px solid #ccc;
  z-index: 1;
`;

const BigNana = styled.img`
  position: absolute;
  width: 200px;
  height: 200px;
  top: 420px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
`;

const StyledSpeechBubble = styled(SpeechBubble)`
  width: 450px;
  height: 180px;
  margin-top: 200px;
  z-index: 2;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
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

const Game3 = () => {
  const navigate = useNavigate();
  const roomId = useSelector((state) => state.room.roomId);
  const client = useSelector((state) => state.client.stompClient);
  const localStream = useSelector((state) => state.room.localStream);
  const openViduToken = useSelector((state) => state.auth.openViduToken);
  const userNo = useSelector((state) => state.auth.userNo);

  const [keywords, setKeywords] = useState([]);
  const [round, setRound] = useState(1);
  const videoRef = useRef(null);

  const [isIgudongseongWelcomeModalOpen, setIsIgudongseongWelcomeModalOpen] =
    useState(true);
  const [isIgudongseongGuideModalOpen, setIsIgudongseongGuideModalOpen] =
    useState(false);
  const [
    isIgudongseongSecondGuideModalOpen,
    setIsIgudongseongSecondGuideModalOpen,
  ] = useState(false);

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showStartImages, setShowStartImages] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState("");

  const endGame = () => {
    navigate("/icebreaking/games/game2");
  };

  useEffect(() => {
    let subscription;
    if (client && roomId) {
      subscription = client.subscribe(`/topic/game/${roomId}`, (message) => {
        const parsedMessage = JSON.parse(message.body);

        if (parsedMessage.commandType === "IGUDONGSEONG_CYCLE") {
          if (round < 6) {
            setRound((prevRound) => prevRound + 1);
            const nextKeyword = keywords[round];
            setCurrentKeyword(nextKeyword);
            setShowStartImages(true);

            setTimeout(() => {
              setShowStartImages(false);
              setIsGameStarted(true);
            }, 5000);
          } else {
            setTimeout(() => {
              navigate("/icebreaking/games");
            }, 3000);
          }
        } else if (parsedMessage.commandType === "IGUDONGSEONG_START") {
          console.log("====키워드 받아서 설정함====", parsedMessage.data);
          setKeywords(parsedMessage.data);

          const keyword = parsedMessage.data[round - 1];
          setCurrentKeyword(keyword);

          setTimeout(() => {
            setShowStartImages(true);
          }, 100);
        } else if (
          parsedMessage.message === "성공!\n" ||
          parsedMessage.message === "실패!\n"
        ) {
          setTimeout(() => {
            if (round < 6) {
              client.send(`/app/game/${roomId}/igudongseong-cycle`);
            } else {
              setTimeout(() => {
                navigate("/icebreaking/games/game4");
              }, 3000);
            }
          }, 3000);
        }
      });
    }

    return () => {
      // 여기에서 세션을 끊지 않도록 설정 (필요에 따라 주석 처리 가능)
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [client, roomId, round, keywords, navigate]);

  useEffect(() => {
    if (isGameStarted) {
      const runPoseNet = async (videoElement) => {
        const net = await posenet.load();

        const pose = await net.estimateSinglePose(videoElement, {
          flipHorizontal: false,
          decodingMethod: "single-person",
        });

        const data = {
          num: userNo,
          keypoints: pose.keypoints,
        };
        client.send(`/app/game/${roomId}/similar`, {}, JSON.stringify(data));
      };

      if (localStream && videoRef.current) {
        const videoElement = videoRef.current;
        videoElement.srcObject = localStream.getMediaStream();
        videoElement.play();

        setTimeout(() => {
          runPoseNet(videoElement);
        }, 3000);
      }
    }
  }, [localStream, videoRef, round, isGameStarted, client, roomId, userNo]);

  const startGameSequence = () => {
    client.send(`/app/game/${roomId}/igudongseong`);

    setTimeout(() => {
      setIsIgudongseongWelcomeModalOpen(false);
      setIsIgudongseongGuideModalOpen(false);
      setIsIgudongseongSecondGuideModalOpen(false);
      setIsGameStarted(false);

      setShowStartImages(true);

      setTimeout(() => {
        setShowStartImages(false);
        setIsGameStarted(true);
      }, 5000);
    }, 100);
  };

  return (
    <Wrap>
      {isIgudongseongWelcomeModalOpen && (
        <GameInfoModal
          planetImg={red}
          planetWidth="150px"
          BlueBtnText={"게임 설명"}
          BlueBtnFn={() => setIsIgudongseongGuideModalOpen(true)}
          modalText={"이구동성 게임에 오신걸 환영합니다 !"}
        />
      )}
      {isIgudongseongGuideModalOpen && (
        <GameModal
          exImg={honaldu}
          RedBtnText={"다음"}
          RedBtnFn={() => setIsIgudongseongSecondGuideModalOpen(true)}
          modalText={
            <>
              EX) 호날두 <br /> 제시어가 주어지면, <br /> 위의 예처럼 포즈를
              취해주세요.
            </>
          }
        />
      )}
      {isIgudongseongSecondGuideModalOpen && (
        <GameModal
          exImg={honaldu}
          RedBtnText={"게임 시작"}
          RedBtnFn={startGameSequence}
          modalText={
            <>
              위 사진처럼 전신이 다 나와야 하며 <br />
              최대한 화면에 몸을 정중앙에 <br />
              맞춰주세요.
            </>
          }
        />
      )}
      {showStartImages && (
        <>
          <SpeechBubble
            word={
              <>
                제시어: {keywords[round]}
                <br />
                5초 안에 포즈를 취하세요!
              </>
            }
          />
          <BigNana src={bigNana} alt="캐릭터" />
        </>
      )}
      <PageWrap>
        {/* <VideoCanvas ref={videoRef} width="640" height="480" /> */}
        {openViduToken && <OpenViduSession token={openViduToken} />}
        <EndGameButton onClick={endGame}>게임 종료</EndGameButton>
      </PageWrap>
    </Wrap>
  );
};

export default Game3;
