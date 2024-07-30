import React from "react";
import styled from "styled-components";
import { useState } from "react";
import profileImage1 from "../../assets/icons/p1.PNG";
import profileImage2 from "../../assets/icons/p2.PNG";
import newProfileImage from "../../assets/icons/newProfile.PNG";

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ProfilesContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
`;

const ProfileWrap = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0 40px;
`;

const SubTitle = styled.h3`
  font-size: 30px;
  color: white;
`;

const Image = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-top: 15px;
  cursor: pointer;
`;

const Tags = styled.div`
  margin-top: 10px;
  text-align: center;
`;

const Tag = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: white;
  font-weight: bold;
`;

const Header = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  width: 100%;
  justify-content: flex-end;
  padding: 20px;
  margin-right: 30px;
`;

const HeaderText = styled.h4`
  font-size: 20px;
  padding: 0 20px;
  color: white;
  cursor: pointer;
`;

const ProfilePick = () => {
  const [existedProfile] = useState(true);

  const profiles = [
    // if profiles existed
    {
      imgSrc: profileImage1,
      tags: ["활발한", "아저씨", "하트"],
    },
    {
      imgSrc: profileImage2,
      tags: ["행복한", "소녀", "하트"],
    },
    // elif profiles not existed, only profileImage3.
    {
      imgSrc: newProfileImage,
      tags: ["새로운", "프로필", "만들기"],
    },
  ];

  return (
    <div>
      <Wrap>
        <Header>
          <HeaderText>마이페이지</HeaderText>
          <HeaderText>커뮤니티</HeaderText>
        </Header>
        <SubTitle>
          사용할 <span style={{ color: "#00FFFF" }}>프로필</span>을 골라주세요
        </SubTitle>
        <ProfilesContainer>
          {profiles.map((profile, index) => (
            <ProfileWrap key={index}>
              <Image src={profile.imgSrc} alt="Profile Image" />
              <Tags>
                {profile.tags.map((tag, idx) => (
                  <Tag key={idx}>#{tag}</Tag>
                ))}
              </Tags>
            </ProfileWrap>
          ))}
        </ProfilesContainer>
      </Wrap>
    </div>
  );
};

export default ProfilePick;
