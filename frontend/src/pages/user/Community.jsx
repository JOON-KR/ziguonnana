import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useInView } from "react-intersection-observer";
import VideoModal from "../../components/modals/VideoModal";
import VideoCard from "../../components/layout/VideoCard";
import TeamRecordModal from "../../components/modals/TeamRecordModal"; // Import TeamRecordModal
import community_bg from "../../assets/images/community_bg.png";
import default_profile from "../../assets/images/default_profile.png"; // 기본 프로필 이미지
import MintBtn from "../../components/common/MintBtn";
import likeIcon from "../../assets/images/like_icon.png"; // 좋아요 아이콘 이미지 경로

// 페이지 전체를 감싸는 스타일 컴포넌트
const PageWrap = styled.div`
  background-image: url(${community_bg});
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
  position: relative;
`;

// 콘텐츠를 감싸는 스타일 컴포넌트
const ContentWrapper = styled.div`
  width: calc(100% - 800px); /* 좌우 여백을 합쳐 800px을 제외한 너비 */
  max-width: 1200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  margin-top: 37px;
  position: relative;
`;

// 제목과 업로드 버튼을 감싸는 스타일 컴포넌트
const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

// 페이지 제목 스타일 컴포넌트
const Title = styled.h2`
  font-size: 30px;
  font-weight: bold;
  color: #58fff5;
`;

// 업로드 버튼 스타일 컴포넌트
const UploadButton = styled(MintBtn)`
  width: 100px;
  height: 40px;
  font-size: 16px;
  margin-top: 100px; /* 위로부터 100px 띄움 */
  position: absolute;
  top: 20px; /* 제목과의 간격 설정 */
  right: 0; /* 콘텐츠 영역의 맨 오른쪽에 위치 */
`;

// 버튼 그룹을 감싸는 스타일 컴포넌트
const ButtonGroup = styled.div`
  margin-bottom: 30px;
  display: flex;
  gap: 10px;
`;

// 프로필 이미지를 표시하는 스타일 컴포넌트
const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  object-fit: cover;
`;

// 비디오 그리드를 감싸는 스타일 컴포넌트
const VideoGridContainer = styled.div`
  width: 660px;
  height: calc(100vh - 100px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3px;

  /* 스크롤바 숨기기 */
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

// 배경을 흐리게 하는 스타일 컴포넌트
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// Community 컴포넌트 정의
const Community = () => {
  // 비디오 목록 상태 관리
  const [videos, setVideos] = useState([
    {
      id: 1,
      videos: [
        {
          url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
          likes: 150,
          date: "2024-07-01",
        },
        {
          url: "https://media.w3.org/2010/05/bunny/trailer.mp4",
          likes: 200,
          date: "2024-07-05",
        },
        {
          url: "https://media.w3.org/2010/05/video/movie_300.mp4",
          likes: 50,
          date: "2024-07-03",
        },
      ],
    },
    {
      id: 2,
      videos: [
        {
          url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
          likes: 250,
          date: "2024-07-02",
        },
        {
          url: "https://media.w3.org/2010/05/bunny/trailer.mp4",
          likes: 100,
          date: "2024-07-06",
        },
        {
          url: "https://media.w3.org/2010/05/video/movie_300.mp4",
          likes: 300,
          date: "2024-07-04",
        },
      ],
    },
    {
      id: 3,
      videos: [
        {
          url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
          likes: 180,
          date: "2024-07-07",
        },
        {
          url: "https://media.w3.org/2010/05/bunny/trailer.mp4",
          likes: 90,
          date: "2024-07-08",
        },
        {
          url: "https://media.w3.org/2010/05/video/movie_300.mp4",
          likes: 60,
          date: "2024-07-09",
        },
      ],
    },
  ]);

  // 선택된 비디오 상태 관리 (모달에서 재생할 비디오 URL)
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isTeamRecordVideo, setIsTeamRecordVideo] = useState(false);

  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 프로필 이미지 상태 관리
  const [profileImage, setProfileImage] = useState(default_profile);

  // 정렬 상태 관리
  const [sortType, setSortType] = useState("latest"); // "latest" or "popular"

  // useInView 훅을 사용하여 화면에 보이는지 여부를 감지
  const { ref, inView } = useInView();

  // 업로드 모달 상태 관리
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // 비디오 URL 배열
  const videoURLs = [
    "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    "https://media.w3.org/2010/05/bunny/trailer.mp4",
    "https://media.w3.org/2010/05/video/movie_300.mp4",
    "https://media.w3.org/2010/05/bunny/movie.mp4",
    "https://media.w3.org/2010/05/sintel/movie.mp4",
  ];

  // 랜덤으로 비디오 URL을 3개 반환하는 함수
  const getRandomVideos = () => {
    return Array.from({ length: 3 }, () => ({
      url: videoURLs[Math.floor(Math.random() * videoURLs.length)],
      likes: Math.floor(Math.random() * 500), // 랜덤 좋아요 수
      date: new Date().toISOString().slice(0, 10), // 오늘 날짜
    }));
  };

  // 더 많은 데이터를 불러오는 함수
  const fetchMoreData = () => {
    setVideos((prevVideos) => [
      ...prevVideos,
      {
        id: prevVideos.length + 1,
        videos: getRandomVideos(),
      },
    ]);
  };

  // inView가 true일 때 더 많은 데이터를 불러옴
  useEffect(() => {
    if (inView) {
      fetchMoreData();
    }
  }, [inView]);

  // 인기순으로 정렬하는 함수
  const sortVideosByLikes = () => {
    const sorted = [...videos].sort((a, b) => {
      const likesA = a.videos.reduce((sum, video) => sum + video.likes, 0);
      const likesB = b.videos.reduce((sum, video) => sum + video.likes, 0);
      return likesB - likesA;
    });
    setVideos(sorted);
  };

  // 최신순으로 정렬하는 함수
  const sortVideosByDate = () => {
    const sorted = [...videos].sort((a, b) => {
      const dateA = new Date(a.videos[0].date);
      const dateB = new Date(b.videos[0].date);
      return dateB - dateA;
    });
    setVideos(sorted);
  };

  useEffect(() => {
    if (sortType === "popular") {
      sortVideosByLikes();
    } else {
      sortVideosByDate();
    }
  }, [sortType]);

  const handleVideoModalClose = () => {
    setSelectedVideo(null);
    if (isTeamRecordVideo) {
      setIsUploadModalOpen(true);
      setIsTeamRecordVideo(false);
    }
  };

  return (
    <PageWrap>
      <ContentWrapper>
        <TitleWrapper>
          <Title>챌린지 쇼츠</Title>
          <UploadButton onClick={() => setIsUploadModalOpen(true)}>
            업로드
          </UploadButton>
        </TitleWrapper>
        <ProfileImage
          src={isLoggedIn ? profileImage : default_profile}
          alt="Profile"
        />
        <ButtonGroup>
          <MintBtn onClick={() => setSortType("popular")}>인기순</MintBtn>
          <MintBtn onClick={() => setSortType("latest")}>최신순</MintBtn>
        </ButtonGroup>
        <VideoGridContainer>
          {videos.map((card) => (
            <VideoCard
              key={card.id}
              videos={card.videos}
              onClick={(video) => setSelectedVideo(video.url)}
            />
          ))}
          <div ref={ref} style={{ height: "20px" }} />
        </VideoGridContainer>
        {selectedVideo && (
          <Overlay onClick={handleVideoModalClose}>
            <VideoModal
              video={selectedVideo}
              onClose={handleVideoModalClose}
              likeIcon={likeIcon}
              title="예시 제목"
              likeCount={100}
              showLikeAndTitle={!isTeamRecordVideo} // 팀 레코드 비디오일 때는 좋아요와 제목을 숨김
            />
          </Overlay>
        )}
        {isUploadModalOpen && (
          <Overlay onClick={() => setIsUploadModalOpen(false)}>
            <TeamRecordModal
              onClose={() => setIsUploadModalOpen(false)}
              onVideoSelect={(videoUrl) => {
                setSelectedVideo(videoUrl);
                setIsUploadModalOpen(false);
                setIsTeamRecordVideo(true);
              }}
            />
          </Overlay>
        )}
      </ContentWrapper>
    </PageWrap>
  );
};

export default Community;
