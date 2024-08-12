import React from "react";
import styled from "styled-components";
import pc from "../../assets/images/profileCard.png";

const Wrap = styled.div`
  display: flex;
  align-items: center;
  background-color: #e5faff;
  border-radius: 15px;
  padding: 20px;
  width: 400px;
  background-image: url(${pc});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const TextWrap = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  background-color: white;
  padding: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Nickname = styled.h1`
  font-size: 20px;
  font-weight: bold;
  color: #2d2d2d;
  margin: 0;
`;

const Features = styled.div`
  margin-top: 5px;
`;

const Feature = styled.h2`
  font-size: 14px;
  color: #6fa6c9;
  margin: 0;
  display: inline-block;
  margin-right: 10px; /* 각 키워드 간 간격 추가 */
`;

const AvatarCard = ({ avatarImage, nickname = 'nick', features = [""] }) => { // 기본값을 빈 배열로 설정
  return (
    <Wrap>
      {/* 이미지 */}
      <Image src={avatarImage} alt="avatar" />
      <TextWrap>
        {/* 닉네임 */}
        <Nickname>{nickname}</Nickname>
        {/* 키워드 리스트 */}
        <Features>
          {features.map((feature, index) => (
            <Feature key={index}># {feature}</Feature> // 각 키워드를 해시태그로 출력
          ))}
        </Features>
      </TextWrap>
    </Wrap>
  );
};

export default AvatarCard;
