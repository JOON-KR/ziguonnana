import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../components/common/Loader";

const PageWrap = styled.div`
  width: 100%;
  /* height: 100vh; Viewport height to fill the screen */
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
  /* height: 100%; */
`;

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = location.state || {};

  //이 부분 수정 필요
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigate("/icebreaking/games", { state: { roomId } });
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, [navigate, roomId]);

  return (
    <PageWrap>
      <Content>
        <Loader currentNum={4} MaxNum={6} />
      </Content>
    </PageWrap>
  );
};

export default Loading;
