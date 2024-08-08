import React from "react";
import styled from "styled-components";
import profileCardImage from "../../assets/images/profileCard.png"; // corrected import name

const ProfileCard = styled.img`
  position: center;
  width: 700px;
  height: auto;
`;

const Game1Avata = () => {
  return <ProfileCard src={profileCardImage} alt="Profile Card" />;
};

export default Game1Avata;
