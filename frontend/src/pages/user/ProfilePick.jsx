import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { getProfileList, createProfile } from "../../api/profile/profileAPI"; // API 함수 import
import profileImage1 from "../../assets/icons/p1.PNG";
import profileImage2 from "../../assets/icons/p2.PNG";
import newProfileImage from "../../assets/icons/newProfile.PNG";
import ProfileRegisterModal from "../../components/modals/ProfileRegisterModal";
import OpenViduComponent from "../../components/OpenViduComponent";

// 스타일 컴포넌트 정의
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
  // 위치 정보 및 상태 관리 변수 선언
  const location = useLocation();
  const { teamName, people, sessionId, inviteCode, token } =
    location.state || {};
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileRegisterModalOpen, setIsProfileRegisterModalOpen] =
    useState(false); // 프로필 등록 모달

  // 프로필 목록을 가져오는 함수
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await getProfileList();
        setProfiles(response.data.data); // 프로필 데이터 설정
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  // 프로필 등록 모달 닫기 함수
  const closeProfileRegisterModal = () => {
    setIsProfileRegisterModalOpen(false);
  };

  // 프로필 등록 함수
  const handleRegisterProfile = async ({ profileImage, name, feature }) => {
    try {
      await createProfile({ name, feature, profileImg: profileImage });
      const response = await getProfileList(); // 등록 후 프로필 목록 다시 불러오기
      setProfiles(response.data.data); // 새로운 프로필 데이터 설정
      setIsProfileRegisterModalOpen(false); // 모달 닫기
    } catch (error) {
      console.error("프로필 등록 실패:", error);
    }
  };

  // 프로필 선택 함수
  const pickProfile = (profileId) => {
    // 프로필 클릭 시, 프로필 선택 로직
  };

  // 로딩 중일 때 표시할 컴포넌트
  if (loading) return <div>Loading...</div>;
  // 에러가 발생했을 때 표시할 컴포넌트
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Wrap>
        {isProfileRegisterModalOpen && (
          <ProfileRegisterModal
            onClose={closeProfileRegisterModal}
            onRegisterProfile={handleRegisterProfile}
          />
        )}
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
              <Image
                src={profile.profileImg}
                alt="Profile Image"
                onClick={() => pickProfile(profile.id)}
              />
              <Tags>
                {profile.feature.split(", ").map((tag, idx) => (
                  <Tag key={idx}>#{tag}</Tag>
                ))}
              </Tags>
            </ProfileWrap>
          ))}
          {profiles.length < 3 && (
            <ProfileWrap>
              <Image
                src={newProfileImage}
                alt="Profile Image"
                onClick={() => setIsProfileRegisterModalOpen(true)}
              />
              <Tags>
                {["새로운", "프로필", "만들기"].map((tag, idx) => (
                  <Tag key={idx}>#{tag}</Tag>
                ))}
              </Tags>
            </ProfileWrap>
          )}
        </ProfilesContainer>
      </Wrap>
      {token && <OpenViduComponent token={token} sessionId={sessionId} />}
    </div>
  );
};

export default ProfilePick;
