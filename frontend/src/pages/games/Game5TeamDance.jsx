import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
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

const Game5TeamDance = () => {
  const roomId = useSelector((state) => state.room.roomId);
  const userNo = useSelector((state) => state.auth.userNo);
  const client = useSelector((state) => state.client.stompClient);
  const localStream = useSelector((state) => state.room.localStream);
  const maxNo = useSelector((state) => state.room.maxNo); // 방 인원 수
  const userVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const [countdown, setCountdown] = useState(3); 
  const [currentUserNo, setCurrentUserNo] = useState(1); 
  const [challengeVideoUrl, setChallengeVideoUrl] = useState(""); 
  const [isRecording, setIsRecording] = useState(false);

  // 사용자 비디오 스트림 설정
  useEffect(() => {
    if (localStream && userVideoRef.current) {
      userVideoRef.current.srcObject = localStream.getMediaStream();
      console.log("로컬 스트림이 비디오 요소에 설정되었습니다.");
    }
  }, [localStream]);

  // 서버에서 브로드캐스트된 현재 사용자 번호 수신
  useEffect(() => {
    if (client && client.connected) {
      const subscription = client.subscribe(`/topic/game/${roomId}`, (message) => {
        const response = JSON.parse(message.body);
        if (
          response.commandType === "SHORTS_SPLITED" &&
          response.message === "SUCCESS"
        ) {
          console.log("서버로부터 받은 데이터:", response.data);
          setCurrentUserNo(response.data.currentUserNo);
          setChallengeVideoUrl(response.data.challengeVideoUrl);
          console.log("현재 사용자 번호:", response.data.currentUserNo);
          console.log("챌린지 비디오 URL:", response.data.challengeVideoUrl);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [client, roomId]);

  // 비디오 및 녹화 시작 로직
  useEffect(() => {
    if (challengeVideoUrl) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      if (countdown === 0) {
        clearInterval(interval);
        startRecording();
      }

      return () => clearInterval(interval);
    }
  }, [challengeVideoUrl, countdown]);

  // 녹화 시작 함수
  const startRecording = () => {
    if (currentUserNo === userNo && !isRecording) {
      setIsRecording(true);
      console.log("녹화가 시작되었습니다.");

      recordedChunks.current = [];
      const options = { mimeType: "video/webm; codecs=vp9" };
      const mediaRecorder = new MediaRecorder(localStream.getMediaStream(), options);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        console.log("녹화된 Blob:", blob);

        const formData = new FormData();
        formData.append("file", blob, `${roomId}_user_${userNo}.webm`);

        try {
          const response = await axios.post(`/api/v1/video/${roomId}/member/${userNo}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          console.log("녹화된 비디오 업로드 성공:", response.data);

          // 다음 사용자로 넘어가는 로직 추가
          if (currentUserNo < maxNo) {
            client.send(`/app/game/${roomId}/shorts/record/${currentUserNo + 1}`, {}, {});
          }
        } catch (error) {
          console.error("비디오 업로드 실패:", error);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, 5000); // 5초 후 녹화 중지
    }
  };

  return (
    <Container>
      <Title>{currentUserNo} 번째 팀원의 순서입니다.</Title>
      {countdown > 0 && <Countdown>{countdown}</Countdown>}
      <VideoContainer>
        <VideoWrapper>
          {challengeVideoUrl && (
            <ChallengeVideo
              src={challengeVideoUrl}
              controls={false}
              autoPlay
            />
          )}
        </VideoWrapper>
        <VideoWrapper>
          {currentUserNo === userNo && (
            <UserVideo ref={userVideoRef} autoPlay muted />
          )}
        </VideoWrapper>
      </VideoContainer>
    </Container>
  );
};

export default Game5TeamDance;
