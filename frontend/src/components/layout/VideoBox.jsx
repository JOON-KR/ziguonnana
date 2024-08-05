import React from "react";
import styled from "styled-components";

const Box = styled.div`
  width: 200px;
  height: 200px;
  background-color: #ebeef1;
  /* background-color: red; */
  padding: 10px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Video = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
`;

const NameTag = styled.div`
  position: absolute;
  bottom: 10px;
  border-radius: 4px;
  display: inline-block;
  color: #f6f8fa;
  background-color: rgba(0, 0, 0, 0.5);
  /* width: 116px; */
  padding: 4px 8px 4px 8px;
  font-size: 12px;
  align-self: flex-start;
`;

const VideoBox = () => {
  return (
    <Box>
      <Video>
        <NameTag>사용자이름</NameTag>
      </Video>
    </Box>
  );
};

export default VideoBox;
