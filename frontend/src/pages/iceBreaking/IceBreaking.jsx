import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { OpenVidu } from "openvidu-browser"; // OpenVidu 임포트
import VideoBox from "../../components/layout/VideoBox";
import { setSession, clearSession, addSubscriber } from "../../store/roomSlice"; // addSubscriber 임포트

const PageWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  gap: 16px;
  width: 200px; /* Fixed width for Frame */
`;

const Content = styled.div`
  flex-grow: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IceBreaking = () => {
  const dispatch = useDispatch();
  const openviduToken = useSelector((state) => state.auth.openViduToken);
  const roomId = useSelector((state) => state.room.roomId);
  const session = useSelector((state) => state.room.session);

  useEffect(() => {
    console.log("현재 Room ID:", roomId);
    console.log("현재 OpenVidu Token:", openviduToken);
    console.log("현재 세션 상태:", session);

    const initializeSession = async () => {
      if (!session) {
        console.log("세션이 없음. 세션 초기화 시도 중...");
        const OV = new OpenVidu();
        const newSession = OV.initSession();

        newSession.on("streamCreated", (event) => {
          const subscriber = newSession.subscribe(event.stream, undefined);
          dispatch(addSubscriber(subscriber));
        });

        await newSession.connect(openviduToken, {});
        dispatch(setSession(newSession));
        console.log("세션 설정됨:", newSession);
      }
    };

    initializeSession();

    return () => {
      if (session) {
        session.disconnect();
        dispatch(clearSession());
      }
    };
  }, [dispatch, roomId, openviduToken, session]);

  return (
    <PageWrap>
      <Frame>
        <VideoBox index={0} />
        <VideoBox index={1} />
        <VideoBox index={2} />
      </Frame>
      <Content></Content>
      <Frame>
        <VideoBox index={3} />
        <VideoBox index={4} />
        <VideoBox index={5} />
      </Frame>
    </PageWrap>
  );
};

export default IceBreaking;
