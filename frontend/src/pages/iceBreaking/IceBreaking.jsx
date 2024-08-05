import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import OpenViduSession from "../../components/OpenViduSession"; // 경로를 맞춰주세요
import VideoBox from "../../components/layout/VideoBox";

const PageWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  gap: 16px;
  box-sizing: border-box;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IceBreaking = () => {
  const location = useLocation();
  const { roomId, openviduToken, profileData } = location.state || {};

  console.log("IceBreaking: Room ID:", roomId);
  console.log("IceBreaking: OpenVidu Token:", openviduToken);
  console.log("IceBreaking: Profile Data:", profileData);

  return (
    <PageWrap>
      <Frame>
        <VideoBox />
        <VideoBox />
        <VideoBox />
      </Frame>
      <Content>
        {openviduToken ? (
          <OpenViduSession token={openviduToken} /> // 받아온 토큰을 OpenViduSession에 전달
        ) : (
          <p>Loading...</p>
        )}
      </Content>
      <Frame>
        <VideoBox />
        <VideoBox />
        <VideoBox />
      </Frame>
    </PageWrap>
  );
};

export default IceBreaking;
