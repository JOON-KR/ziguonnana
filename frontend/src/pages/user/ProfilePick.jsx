import React from "react";
import axios from "axios";
import BASE_URL from "../../api/APIconfig"
import styled from "styled-components";
import { useState, useEffect } from "react";
import profileImage1 from "../../assets/icons/p1.PNG";
import profileImage2 from "../../assets/icons/p2.PNG";
import newProfileImage from "../../assets/icons/newProfile.PNG";
import ProfileRegisterModal from "../../components/modals/ProfileRegisterModal";


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
  font-size: 36px;
  color: white;
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
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
  font-size: 20px;
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
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existedProfile] = useState(true);  // 프로필 존재 여부
  const [isProfileRegisterModalOpen, setIsProfileRegisterModalOpen] = useState(false);  // 프로필 등록 모달

  // get: 프로필 가져오기
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // request header
        const headers = {
          "Content-type" : "application/json",
          "Authorization" : "Bearer [accessToken]"
        };

        // get 요청 보내기
        const res = await axios.get(`${BASE_URL}/api/v1/profile`, {headers});

        // response data
        setProfiles(res.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  // post: 프로필 등록 <- 모달

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const pickProfile = () => {
    // 프로필 클릭 시, 프로필 선택되게 하는 로직
  };

  // 프로필 등록 모달 닫기 함수
  const closeProfileRegisterModal = () => {
    setIsProfileRegisterModalOpen(false);
  }

  // if profiles existed
  const myProfiles = [
    {
      imgSrc: profileImage1,
      tags: ["활발한", "아저씨", "하트"],
    },
    {
      imgSrc: profileImage2,
      tags: ["행복한", "소녀", "하트"],
    },
  ];
  
  // elif profiles not existed, only profileImage3.
  // const newProfile = [
  //   {
  //     imgSrc: newProfileImage,
  //     tags: ["새로운", "프로필", "만들기"],
  //   },
  // ];

  return (
    <div>
      <Wrap>
        {/* ProfileRegisterModal이 열려있을 때 ProfileRegisterModal을 렌더링 */}
        {isProfileRegisterModalOpen && (
          <ProfileRegisterModal onClose={closeProfileRegisterModal} />
        )}
        <Header>
          <HeaderText>마이페이지</HeaderText>
          <HeaderText>커뮤니티</HeaderText>
        </Header>
        <SubTitle>
          사용할 <span style={{ color: "#00FFFF" }}>프로필</span>을 골라주세요
        </SubTitle>
        <ProfilesContainer>
          {/* 미리 만들어놓은 프로필 가져오기 */}
          {myProfiles.map((profile, index) => (
            <ProfileWrap key={index}>
              <Image src={profile.imgSrc} alt="Profile Image" onClick={pickProfile} />
              <Tags>
                {profile.tags.map((tag, idx) => (
                  <Tag key={idx}>#{tag}</Tag>
                ))}
              </Tags>
            </ProfileWrap>
          ))}
          {/* 새로운 프로필 만들기 */}
          <ProfileWrap>
            <Image src={newProfileImage} alt="Profile Image" onClick={() => setIsProfileRegisterModalOpen(true)}/>
            <Tags>
              {["새로운", "프로필", "만들기"].map((tag, idx) => (
                <Tag key={idx}>#{tag}</Tag>
              ))}
            </Tags>
          </ProfileWrap>

        </ProfilesContainer>
      </Wrap>
    </div>
  );
};

export default ProfilePick;
