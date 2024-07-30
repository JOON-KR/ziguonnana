import React from "react";
// <<<<<<< HEAD
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
    // =======
    // import styled from "styled-components";
    // import frozenBlueImg from '../../assets/icons/frozen_blue.png';
    // import frozenOrangeImg from '../../assets/icons/frozen_orange.png';
    // import frozenRedImg from '../../assets/icons/frozen_red.png';
    // import frozenGrayImg from '../../assets/icons/frozen_gray.png';
    // import frozenEarthImg from '../../assets/icons/frozen_earth.png';
    // import nanaImg from '../../assets/icons/nana.png';
    // import rocketImg from '../../assets/icons/rocket.png';
    // import backgroundImage from '../../assets/images/gameMap.png';

    // const Background = styled.div`
    //   position: absolute;
    //   width: 100%;
    //   height: 100vh;
    //   background: url(${backgroundImage}) no-repeat center center;
    //   background-size: cover;
    //   z-index: -1;
    // `;

    // const Wrap = styled.div`
    //   width: 100%;
    //   height: 100vh;
    //   display: flex;
    //   flex-direction: column;
    //   align-items: center;
    // `;

    // const GameWrap = styled.div`
    //   position: absolute;
    //   display: flex;
    //   flex-direction: column;
    //   align-items: center;
    //   ${(props) => props.top && `top: ${props.top}px;`}
    //   ${(props) => props.left && `left: ${props.left}px;`}
    //   ${(props) => props.bottom && `bottom: ${props.bottom}px;`}
    //   ${(props) => props.right && `right: ${props.right}px;`}
    // `;

    // const Title = styled.h1`
    //   font-size: 53px;
    //   font-weight: 550;
    //   color: white;
    //   margin: 55px 0px;
    // `;

    // const GameName = styled.h4`
    //   font-size: 18px;
    //   padding: 0 20px;
    //   margin-left: 5px;
    //   color: white;
    //   cursor: pointer;
    // `;

    // const Image = styled.img`
    //   width: 190px;
    //   height: 190px;
    //   cursor: pointer;
    // `;

    // const RocketImage = styled.img`
    //   width: 120px;
    //   height: 120px;
    //   cursor: pointer;
    // `;

    // const Rocket = styled.div`
    //   width: 80px;
    //   position: absolute;
    //   display: flex;
    //   top: 320px;
    //   left: 70px;
    // `

    // const NanaImage = styled.img`
    //   width: 160px;
    //   height: 160px;
    //   cursor: pointer;
    // `;

    // const Nana = styled.div`
    //   width: 80px;
    //   position: absolute;
    //   display: flex;
    //   top: 410px;
    //   right: 170px;
    // `

    // const games = [
    //   {
    //     imgSrc: frozenBlueImg,
    //     name: '아바타',
    //     top: 400,
    //     left: 70,
    //   },
    //   {
    //     imgSrc: frozenOrangeImg,
    //     name: '몸으로 말해요',
    //     top: 160,
    //     left: 200,
    //   },
    //   {
    //     imgSrc: frozenRedImg,
    //     name: '이구동성',
    //     top: 400,
    //     left: 400,
    //   },
    //   {
    //     imgSrc: frozenGrayImg,
    //     name: '포즈따라하기',
    //     top: 160,
    //     right: 200,
    //   },
    //   {
    //     imgSrc: frozenEarthImg,
    //     name: '숫폼챌린지',
    //     top: 400,
    //     right: 70,
    //   },
    // ];

    // const Games = () => {
    //   return (
    //     <div>
    //       {/* <Background />  <- 위치 수정 필요 */}
    //       <Wrap>
    //         <Title>ICE-BREAKING MAP</Title>
    //         <Rocket>
    //           <RocketImage src={rocketImg} />
    //         </Rocket>
    //         {games.map((game, idx) => (
    //           <GameWrap key={idx} top={game.top} left={game.left} right={game.right}>
    //             <Image src={game.imgSrc} alt="Game Image" />
    //             <GameName>{game.name}</GameName>
    //           </GameWrap>
    //         ))}
    //         <Nana>
    //           <NanaImage src={nanaImg} />
    //         </Nana>
    //       </Wrap>
    //     </div>
    // >>>>>>> 1e586a8f067c57a9a6e6d35591a917b78edd7592
  );
};

export default Games;
