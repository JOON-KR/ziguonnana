import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트
import GameModal from "../../components/modals/GameModal";
import GameInfoModal from "../../components/modals/GameInfoModal";
import styled from "styled-components";
import SpeechBubble from "../../components/speechBubble/SpeechBubble"; // SpeechBubble 컴포넌트 가져오기
import red from "../../assets/icons/red.png";
import honaldu from "../../assets/images/igudong_ex_img.png";
import bigNana from "../../assets/images/bigNana.png"; // 캐릭터 이미지
import { useSelector } from "react-redux";
import * as posenet from "@tensorflow-models/posenet";
import "@tensorflow/tfjs";
import OpenViduSession from "../../components/OpenViduSession";

// 메인 화면을 감싸는 컨테이너 스타일 정의
const Wrap = styled.div`
  width: 90%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// 페이지 전체를 감싸는 컨테이너 스타일 정의
const PageWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative; /* 모달을 위한 상대적 위치 지정 */
`;

// 비디오 캔버스 스타일 정의
const VideoCanvas = styled.video`
  width: 640px;
  height: 480px;
  border: 1px solid #ccc;
  z-index: 1; /* 비디오를 가장 아래 레이어로 배치 */
`;

// 캐릭터 이미지를 조정하여 말풍선보다 100px 아래에 배치하고 크기를 키움
const BigNana = styled.img`
  position: absolute;
  width: 200px;
  height: 200px;
  top: 420px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3; /* 캐릭터를 비디오 위에 오버레이 */
`;

// 말풍선의 크기를 조정
const StyledSpeechBubble = styled(SpeechBubble)`
  width: 450px;
  height: 180px;
  margin-top: 200px;
  z-index: 2; /* 말풍선을 비디오 위에 오버레이 */
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.8); /* 반투명 배경 */
  padding: 20px;
  border-radius: 10px;
`;

const Game3 = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
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

  useEffect(() => {
    const subscription = client.subscribe(
      `/topic/game/${roomId}`,
      (message) => {
        const parsedMessage = JSON.parse(message.body);

        if (parsedMessage.commandType === "IGUDONGSEONG_CYCLE") {
          if (round < 6) {
            console.log("다음 라운드 시작================");
            setRound((prevRound) => prevRound + 1);
            const nextKeyword = keywords[round];
            setCurrentKeyword(nextKeyword);
            setShowStartImages(true);

            setTimeout(() => {
              setShowStartImages(false);
              // setShowStartImages(true);
              setIsGameStarted(true);
            }, 5000);
          } else {
            console.log("게임 종료!");
            navigate("/icebreaking/games"); // 게임 종료 후 리다이렉트
          }
        } else if (parsedMessage.commandType === "IGUDONGSEONG_START") {
          console.log("이구동성 키워드 수신:", parsedMessage.data);
          setKeywords(parsedMessage.data);

          const keyword = parsedMessage.data[round - 1];
          setCurrentKeyword(keyword);
          console.log("현재 제시어:", keyword);

          setTimeout(() => {
            setShowStartImages(true);
          }, 3000);
        } else if (
          parsedMessage.data === "성공!" ||
          parsedMessage.data === "실패!"
        ) {
          console.log(`결과 수신: ${parsedMessage.message}`);
          // 결과에 따라 3초 후에 다음 라운드로 이동
          setTimeout(() => {
            if (round < 6) {
              client.send(`/app/game/${roomId}/igudongseong-cycle`);
            } else {
              console.log("게임이 끝났습니다.");
              navigate("/icebreaking/games"); // 게임 종료 후 리다이렉트
            }
          }, 3000);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
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
        console.log("전송 메시지 : ", data);
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
    <Wrap style={{ fontSize: "50px" }}>
      <h1>라운드 : {round}</h1>
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
          <StyledSpeechBubble
            word={
              <>
                제시어: {keywords[round - 1]}
                <br />
                5초 안에 포즈를 취하세요!
              </>
            }
          />
          <BigNana src={bigNana} alt="캐릭터" />
        </>
      )}
      <PageWrap>
        <VideoCanvas ref={videoRef} width="640" height="480" />
        {openViduToken && <OpenViduSession token={openViduToken} />}
      </PageWrap>
    </Wrap>
  );
};

export default Game3;
