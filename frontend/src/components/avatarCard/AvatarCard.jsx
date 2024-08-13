import React from "react";
import styled from "styled-components";
import pc from "../../assets/images/profileCard.png";

const Wrap = styled.div`
  display: flex;
  align-items: center;
  background-color: #e5faff;
  border-radius: 12px;
  padding: 20px;
  width: 300px;
  height: 110px;
  background-image: url(${pc});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 30px;
`;

const TextWrap = styled.div`
  margin-left: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Image = styled.img`
  width: 110px;
  height: 100px;
  padding: 10px;
`;

const Nickname = styled.h1`
  font-size: 20px;
  font-weight: bold;
  color: #2d2d2d;
  margin: 0;
`;

const Features = styled.div`
  margin-top: 15px;
`;

const Feature = styled.h2`
  font-size: 14px;
  color: #6fa6c9;
  margin: 0;
  display: inline-block;
  margin-right: 10px; /* 각 키워드 간 간격 추가 */
`;

const AvatarCard = ({ avatarImage, nickname, features = [] }) => { // 기본값을 빈 배열로 설정

  return (
    <Wrap>
      {/* 이미지 */}
      <Image src={avatarImage} />
      <TextWrap>
        {/* 닉네임 */}
        <Nickname>{nickname}</Nickname>
        {/* 키워드 리스트 */}
        <Features>
          {features.map((feature, index) => (
            <Feature key={index}>#{feature}</Feature> // 각 키워드를 해시태그로 출력
          ))}
        </Features>
      </TextWrap>
    </Wrap>
  );
};

export default AvatarCard;
