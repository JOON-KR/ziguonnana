import React from "react";
import pickPlanet from "../../assets/images/pickPlanet.png";
import styled from "styled-components";
import blue from "../../assets/icons/blue.png";
import frozen_blue from "../../assets/icons/frozen_blue.png";
import earth from "../../assets/icons/earth.png";
import frozen_earth from "../../assets/icons/frozen_earth.png";
import orange from "../../assets/icons/orange.png";
import frozen_orange from "../../assets/icons/frozen_orange.png";
import red from "../../assets/icons/red.png";
import frozen_red from "../../assets/icons/frozen_red.png";
import gray from "../../assets/icons/gray.png";
import frozen_gray from "../../assets/icons/frozen_gray.png";
import { useNavigate } from "react-router-dom";

const Wrap = styled.div`
  width: 819px;
  height: 348px;
  background-image: url(${pickPlanet});
  /* background-size: cover; */
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
`;

const Planet = styled.img`
  position: absolute;
  width: 100px;
  height: 100px;
  cursor: pointer;
`;

const Games = () => {
  const BASE = "/icebreaking/games";
  const navigate = useNavigate();
  return (
    <Wrap>
      <Planet
        onClick={() => {
          navigate(`${BASE}/game1`);
        }}
        src={blue}
        style={{ left: "50px", bottom: "90px" }}
      />
      <Planet
        onClick={() => {
          navigate(`${BASE}/game2`);
        }}
        src={orange}
        style={{ left: "200px", top: "20px" }}
      />
      <Planet
        onClick={() => {
          navigate(`${BASE}/game3`);
        }}
        src={red}
        style={{
          left: "380px",
          bottom: "80px",
          width: "106px",
          height: "120px",
        }}
      />
      <Planet
        onClick={() => {
          navigate(`${BASE}/game4`);
        }}
        src={gray}
        style={{ left: "", right: "200px", top: "20px" }}
      />
      <Planet
        onClick={() => {
          navigate(`${BASE}/game5`);
        }}
        src={earth}
        style={{
          left: "",
          right: "10px",
          bottom: "120px",
          width: "121px",
          height: "100px",
        }}
      />
    </Wrap>
  );
};

export default Games;
