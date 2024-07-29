import React from "react";
import styled from "styled-components";
import mypage_bg from "../../assets/images/mypage_bg.png";

const PageWrap = styled.div`
  background-image: url(${mypage_bg});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const MyPage = () => {
  return <PageWrap>MyPage</PageWrap>;
};

export default MyPage;
