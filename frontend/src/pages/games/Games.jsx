import React from "react";
import styled from "styled-components";
import frozenBlueImg from '../../assets/icons/frozen_blue.png';
import frozenOrangeImg from '../../assets/icons/frozen_orange.png';
import frozenRedImg from '../../assets/icons/frozen_red.png';
import frozenGrayImg from '../../assets/icons/frozen_gray.png';
import frozenEarthImg from '../../assets/icons/frozen_earth.png';
import nanaImg from '../../assets/icons/nana.png';
import rocketImg from '../../assets/icons/rocket.png';
import backgroundImage from '../../assets/images/gameMap.png';

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  background: url(${backgroundImage}) no-repeat center center;
  background-size: cover;
  z-index: -1;
`;

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GameWrap = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${(props) => props.top && `top: ${props.top}px;`}
  ${(props) => props.left && `left: ${props.left}px;`}
  ${(props) => props.bottom && `bottom: ${props.bottom}px;`}
  ${(props) => props.right && `right: ${props.right}px;`}
`;

const Title = styled.h1`
  font-size: 53px;
  font-weight: 550;
  color: white;
  margin: 55px 0px;
`;

const GameName = styled.h4`
  font-size: 18px;
  padding: 0 20px;
  margin-left: 5px;
  color: white;
  cursor: pointer;
`;

const Image = styled.img`
  width: 190px;
  height: 190px;
  cursor: pointer;
`;

const RocketImage = styled.img`
  width: 120px;
  height: 120px;
  cursor: pointer;
`;

const Rocket = styled.div`
  width: 80px;
  position: absolute;
  display: flex;
  top: 320px;
  left: 70px;
`

const NanaImage = styled.img`
  width: 160px;
  height: 160px;
  cursor: pointer;
`;

const Nana = styled.div`
  width: 80px;
  position: absolute;
  display: flex;
  top: 410px;
  right: 170px;
`

const games = [
  {
    imgSrc: frozenBlueImg,
    name: '아바타',
    top: 400,
    left: 70,
  },
  {
    imgSrc: frozenOrangeImg,
    name: '몸으로 말해요',
    top: 160,
    left: 200,
  },
  {
    imgSrc: frozenRedImg,
    name: '이구동성',
    top: 400,
    left: 400,
  },
  {
    imgSrc: frozenGrayImg,
    name: '포즈따라하기',
    top: 160,
    right: 200,
  },
  {
    imgSrc: frozenEarthImg,
    name: '숫폼챌린지',
    top: 400,
    right: 70,
  },
];

const Games = () => {
  return (
    <div>
      {/* <Background />  <- 위치 수정 필요 */}
      <Wrap>
        <Title>ICE-BREAKING MAP</Title>
        <Rocket>
          <RocketImage src={rocketImg} />
        </Rocket>
        {games.map((game, idx) => (
          <GameWrap key={idx} top={game.top} left={game.left} right={game.right}>
            <Image src={game.imgSrc} alt="Game Image" />
            <GameName>{game.name}</GameName>
          </GameWrap>
        ))}
        <Nana>
          <NanaImage src={nanaImg} />
        </Nana>
      </Wrap>
    </div>
  );
};

export default Games;
