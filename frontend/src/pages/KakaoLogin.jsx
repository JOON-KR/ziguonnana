import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const KakaoLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 쿠키에서 accessToken과 refreshToken 가져오기
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    
    if (accessToken && refreshToken) {
      // 로컬 스토리지에 저장
      localStorage.setItem('kakao_access_token', accessToken);
      localStorage.setItem('kakao_refresh_token', refreshToken);
    }
  }, []);

  const handleRedirect = () => {
    // "/" 경로로 이동
    navigate('/');
  };

  return (
    <div>
      <h1>Kakao 로그인 처리</h1>
      <p>쿠키에서 토큰을 확인한 후 로컬 스토리지에 저장했습니다.</p>
      <button onClick={handleRedirect}>홈으로 이동</button>
    </div>
  );
};

export default KakaoLogin;
