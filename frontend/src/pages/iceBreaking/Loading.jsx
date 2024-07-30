import React from "react";
import styled from "styled-components";
import VideoBox from "../../components/layout/VideoBox";
import Loader from "../../components/common/Loader";

const PageWrap = styled.div`
  width: 100%;
  height: 100vh; /* Viewport height to fill the screen */
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
  flex-grow: 1; /* Allow Content to grow and take remaining space */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Loading = () => {
  return (
    <PageWrap>
      {/* <Frame>
          <VideoBox />
          <VideoBox />
          <VideoBox />
        </Frame> */}
      <Content>
        <Loader currentNum={4} MaxNum={6} />
      </Content>
      {/* <Frame>
          <VideoBox />
          <VideoBox />
          <VideoBox />
        </Frame> */}
    </PageWrap>
  );
};

export default Loading;
