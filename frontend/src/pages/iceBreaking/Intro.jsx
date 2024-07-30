import React, { useEffect, useState } from "react";
import styled from "styled-components";
import story1 from "../../assets/images/story1.png";
import story2 from "../../assets/images/story2.png";
import story3 from "../../assets/images/story3.png";
import story4 from "../../assets/images/story4.png";
import nana from "../../assets/icons/nana.png";
import { useNavigate } from "react-router-dom";
import firstGame from "../../assets/images/firstGame.png";

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
  text-align: center;
`;

const Text = styled.h1`
  font-size: 50px;
  font-weight: 600;
`;

const Image = styled.div`
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 800px;
  height: 700px;
  /* height: 500px; */
`;

const Introduce = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [index, setIndex] = useState(0);
  const [isStoryFinished, setIsStoryFinished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const images = [nana, story1, story2, story3, story4];
    let localIndex = 0;

    const interval = setInterval(() => {
      setCurrentImage(images[localIndex]);
      setIndex(localIndex);
      localIndex += 1;
      if (localIndex >= images.length) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleClick = () => {
    if (index === 4) {
      setIsStoryFinished(true);
    }
  };

  return (
    <Wrap>
      {!isStoryFinished && (
        <>
          {currentImage === nana ? (
            <>
              <Text>지금부터 나나의 침략을 막아나나</Text>
              <Image src={currentImage} onClick={handleClick} />
            </>
          ) : (
            currentImage && <Image src={currentImage} onClick={handleClick} />
          )}
        </>
      )}
      {isStoryFinished && (
        <Image
          src={firstGame}
          onClick={() => {
            navigate("/icebreaking/games/game1");
          }}
        />
      )}
    </Wrap>
  );
};

export default Introduce;
