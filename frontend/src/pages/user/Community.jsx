import React from "react";
import styled from "styled-components";
import community_bg from "../../assets/images/community_bg.png";

const PageWrap = styled.div`
  background-image: url(${community_bg});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Community = () => {
  return <PageWrap>Community</PageWrap>;
};

export default Community;
