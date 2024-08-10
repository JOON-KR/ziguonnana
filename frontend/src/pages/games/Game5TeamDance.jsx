import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import BASE_URL from "../../api/APIconfig";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: 100vh;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Countdown = styled.div`
  font-size: 48px;
  color: red;
  font-weight: bold;
  margin-bottom: 20px;
`;

const VideoContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 70%;
`;

const VideoWrapper = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChallengeVideo = styled.video`
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 10px;
  background-color: #000;
`;

const UserVideo = styled.video`
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 10px;
  background-color: black;
`;

const NextButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Game5TeamDance = () => {
  const roomId = useSelector((state) => state.room.roomId);
  const userNo = useSelector((state) => state.auth.userNo);
  const client = useSelector((state) => state.client.stompClient);
  const localStream = useSelector((state) => state.room.localStream);
  const subscribers = useSelector((state) => state.room.subscribers);
  const maxNo = useSelector((state) => state.room.maxNo);

  const userVideoRef = useRef(null);
  const subscriberVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const [countdown, setCountdown] = useState(3);
  const [currentUserNo, setCurrentUserNo] = useState(1);
  const [challengeVideoUrl, setChallengeVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState(5000); // 기본 녹화 시간을 5초로 설정
  const [isRecording, setIsRecording] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);

  // 자신의 로컬 스트림 설정
  useEffect(() => {
    if (localStream && userVideoRef.current && currentUserNo === userNo) {
      userVideoRef.current.srcObject = localStream.getMediaStream();
      console.log("로컬 스트림이 비디오 요소에 설정되었습니다.", localStream);
    }
  }, [localStream, currentUserNo, userNo]);

  // 다른 사용자의 스트림 설정
  useEffect(() => {
    if (subscribers.length > 0 && subscriberVideoRef.current && currentUserNo !== userNo) {
      const subscriber = subscribers.find(sub => sub.stream.connection.data === `{"userNo":${currentUserNo}}`);
      if (subscriber) {
        subscriberVideoRef.current.srcObject = subscriber.stream.getMediaStream();
        console.log("서브스크립션 스트림이 비디오 요소에 설정되었습니다.", subscriber.stream);
      }
    }
  }, [subscribers, currentUserNo, userNo]);

  // 서버로 메시지 전송
  useEffect(() => {
    if (client && client.connected) {
      console.log("send:", `/app/game/${roomId}/shorts/record/${currentUserNo}`);
      client.send(`/app/game/${roomId}/shorts/record/${currentUserNo}`, {}, {});
    } else {
      console.warn("send 부분에서 문제 발생");
    }
  }, [client, roomId, currentUserNo]);

  // 서버로부터 메시지 수신 및 상태 업데이트
  useEffect(() => {
    if (client && client.connected) {
      const subscription = client.subscribe(`/topic/game/${roomId}`, (message) => {
        try {
          console.log("서버로부터 받은 메시지:", message.body);
          const response = JSON.parse(message.body);
          if (response.commandType === "SHORTS_SPLITED" && response.message === "SUCCESS") {
            console.log("서버로부터 받은 데이터:", response.data);
            setCurrentUserNo(response.data.currentUserNo);
            setChallengeVideoUrl(response.data.challengeVideoUrl);
            setVideoDuration(response.data.videoDuration || 5000); // 서버에서 받아온 videoDuration 값 설정
            setCountdown(3);
            setIsButtonVisible(false);
            setIsRecording(false);
            setShouldPlayVideo(false); // 카운트다운 동안 비디오 재생 금지
          }
        } catch (error) {
          console.error("메시지 처리 중 오류 발생:", error);
        }
      });

      return () => {
        console.log("구독을 취소합니다.");
        subscription.unsubscribe();
      };
    } else {
      console.warn("클라이언트가 연결되지 않았거나 문제가 발생했습니다.");
    }
  }, [client, roomId]);

  // 카운트다운 및 녹화 시작
  useEffect(() => {
    let interval;
    if (challengeVideoUrl && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(interval);
      setShouldPlayVideo(true); // 카운트다운이 끝나면 비디오 재생 시작
      startRecording(); // 녹화 시작
    }

    return () => clearInterval(interval);
  }, [challengeVideoUrl, countdown, currentUserNo, userNo]);

  const startRecording = () => {
    if (currentUserNo === userNo && !isRecording) {
      setIsRecording(true);
      console.log("현재 녹화되고 있는 사용자 번호: ", currentUserNo);

      recordedChunks.current = [];
      const options = { mimeType: "video/webm; codecs=vp9" };
      const mediaRecorder = new MediaRecorder(localStream.getMediaStream(), options);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("녹화된 데이터 청크:", event.data);
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        console.log("녹화된 Blob:", blob);

        const formData = new FormData();
        formData.append("file", blob, `${roomId}_user_${currentUserNo}.webm`);

        try {
          const response = await axios.post(`${BASE_URL}/api/v1/video/${roomId}/member/${currentUserNo}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("녹화된 비디오 업로드 성공:", response.data);

          setIsButtonVisible(true); // 녹화가 완료된 후에 버튼 표시
        } catch (error) {
          console.error("비디오 업로드 실패:", error);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      // 녹화가 끝나면 자동으로 중지
      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, videoDuration); // 서버에서 받아온 비디오 재생 시간만큼 녹화
    }
  };

  const handleNextUser = () => {
    setIsButtonVisible(false);

    if (currentUserNo < maxNo) {
      console.log("다음 사용자로 요청을 보냅니다:", currentUserNo + 1);
      client.send(`/app/game/${roomId}/shorts/record/${currentUserNo + 1}`, {}, {});
    } else if (currentUserNo === maxNo) {
      console.log("모든 사용자가 완료되었습니다.");
    }
  };

  return (
    <Container>
      <Title>{currentUserNo} 번째 팀원의 순서입니다.</Title>
      {countdown > 0 && <Countdown>{countdown}</Countdown>}
      <VideoContainer>
        <VideoWrapper>
          {shouldPlayVideo && challengeVideoUrl && (
            <ChallengeVideo
              src={challengeVideoUrl}
              controls={false}
              autoPlay
            />
          )}
        </VideoWrapper>
        <VideoWrapper>
          {currentUserNo === userNo ? (
            <UserVideo ref={userVideoRef} autoPlay muted />
          ) : (
            <UserVideo ref={subscriberVideoRef} autoPlay muted />
          )}
        </VideoWrapper>
      </VideoContainer>
      {isButtonVisible && (
        <NextButton onClick={handleNextUser}>
          다음 팀원으로
        </NextButton>
      )}
    </Container>
  );
};

export default Game5TeamDance;
