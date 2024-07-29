import React from "react";
import styled, { keyframes } from "styled-components";

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const blinkCursor = keyframes`
  50% {
    border-right-color: transparent;
  }
`;

const Counts = styled.h1`
  font-size: 51px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 30px;
`;

const typeAndDelete = keyframes`
  0%, 10% {
    width: 0;
  }
  45%, 55% {
    width: 6.2em;
  }
  90%, 100% {
    width: 0;
  }
`;

const TerminalLoader = styled.div`
  border: 0.1em solid #333;
  background-color: #1a1a1a;
  color: #0f0;
  font-family: "Courier New", Courier, monospace;
  font-size: 1em;
  padding: 1.5em 1em;
  width: 400px;
  height: 250px;
  /* margin: 100px auto; */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  position: relative;
  /* overflow: hidden; */
  box-sizing: border-box;
`;

const TerminalHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1.5em;
  background-color: #333;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 0 0.4em;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TerminalControls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Control = styled.div`
  display: inline-block;
  width: 0.6em;
  height: 0.6em;
  margin-left: 0.4em;
  border-radius: 50%;
  background-color: #777;

  &.close {
    background-color: #e33;
  }

  &.minimize {
    background-color: #ee0;
  }

  &.maximize {
    background-color: #0b0;
  }
`;

const TerminalTitle = styled.div`
  line-height: 1.5em;
  color: #eee;
`;

const Text = styled.div`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  border-right: 0.2em solid green;
  animation: ${typeAndDelete} 4s steps(11) infinite,
    ${blinkCursor} 0.5s step-end infinite alternate;
  margin-top: 1.5em;
`;

const Loader = ({ currentNum, MaxNum }) => {
  return (
    <Wrap>
      <TerminalLoader>
        <TerminalHeader>
          <TerminalTitle>Status</TerminalTitle>
          <TerminalControls>
            <Control className="close" />
            <Control className="minimize" />
            <Control className="maximize" />
          </TerminalControls>
        </TerminalHeader>
        <Text>Loading...</Text>
      </TerminalLoader>
      <Counts>
        ({currentNum} / {MaxNum})
      </Counts>
    </Wrap>
  );
};

export default Loader;
