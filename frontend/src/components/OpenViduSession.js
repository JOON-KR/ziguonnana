import React, { useEffect } from "react";
import { OpenVidu } from "openvidu-browser";
import { useDispatch, useSelector } from "react-redux";
import {
  setSession,
  setPublisher,
  addSubscriber,
  clearSession,
  setLocalStream,
} from "../store/roomSlice";
import styled from "styled-components";

// Styled component for the video container
const VideoContainer = styled.div`
  display: none;
`;

const OpenViduSession = ({ token }) => {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.room.session);
  const userNo = useSelector((state) => state.auth.userNo);

  useEffect(() => {
    const initSession = async () => {
      try {
        const OV = new OpenVidu();
        const session = OV.initSession();

        // 스트림 생성 시 구독하고 Redux 스토어에 추가
        session.on("streamCreated", (event) => {
          const subscriber = session.subscribe(event.stream, undefined);
          console.log(
            `Subscribing to stream from connection ID: ${event.stream.connection.connectionId}`
          );
          console.log(
            `Subscriber connection data: ${event.stream.connection.data}`
          );
          dispatch(addSubscriber(subscriber));
          console.log("Stream created and subscriber added");
        });

        // 세션 연결 시도
        await session.connect(token, { userNo: userNo });
        console.log("Session connected with token:", token);

        // 퍼블리셔 초기화
        const publisher = await OV.initPublisherAsync(undefined, {
          audioSource: undefined, // 기본 오디오 소스 사용
          videoSource: undefined, // 기본 비디오 소스 사용
          publishAudio: true,
          publishVideo: true,
          resolution: "640x480",
          frameRate: 30,
          insertMode: "APPEND",
          mirror: true,
        });

        // 퍼블리셔를 세션에 공개
        await session.publish(publisher);
        console.log("Publisher initialized and published");

        // 상태 업데이트
        dispatch(setSession(session));
        dispatch(setPublisher(publisher));
        dispatch(setLocalStream(publisher.stream));
      } catch (error) {
        console.error("Error initializing session:", error);
      }
    };

    // 세션이 없고 토큰이 존재하는 경우 세션 초기화
    if (!session && token) {
      initSession();
    }

    // 컴포넌트 언마운트 시 세션 해제
    return () => {
      if (session) {
        console.log("Disconnecting session");
        session.disconnect(); // 세션 연결 해제
        dispatch(clearSession()); // 세션 초기화 액션 디스패치
      }
    };
  }, [token, session, userNo, dispatch]);

  return <VideoContainer />; // 비디오 컨테이너 반환
};

export default OpenViduSession;
