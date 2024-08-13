import React from "react";
import styled from "styled-components";
import pc from "../../assets/images/profileCard.png";

const Wrap = styled.div`
  display: flex;
  align-items: center;
  background-color: #e5faff;
  border-radius: 12px;
  padding: 30px; /* 패딩을 더 크게 설정 */
  width: 400px; /* 전체 너비를 더 크게 설정 */
  height: 150px; /* 전체 높이를 더 크게 설정 */
  background-image: url(${pc});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 30px;
`;

const TextWrap = styled.div`
  margin-left: 50px; /* 텍스트 왼쪽 여백을 더 크게 설정 */
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Image = styled.img`
  width: 130px; /* 이미지 크기를 더 크게 설정 */
  height: 130px; /* 이미지 크기를 더 크게 설정 */
  padding: 10px;
`;

const Nickname = styled.h1`
  font-size: 24px; /* 닉네임 폰트 크기를 더 크게 설정 */
  font-weight: bold;
  color: #2d2d2d;
  margin: 0;
`;

const Feature = styled.h2`
  font-size: 16px; /* 키워드 폰트 크기를 더 크게 설정 */
  color: #6fa6c9;
  margin: 0;
  display: inline-block;
  margin-right: 12px; /* 각 키워드 간 간격을 더 크게 설정 */
`;



const Features = styled.div`
  margin-top: 15px;
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
