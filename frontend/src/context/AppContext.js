import React, { createContext, useContext, useState } from "react";

// AppContext 생성
const AppContext = createContext();

/**
 * AppProvider 컴포넌트
 *
 * 이 컴포넌트는 상태를 전역적으로 관리하고 자식 컴포넌트들에게 제공하는 역할을 합니다.
 *
 * @param {object} props - 컴포넌트의 props
 * @param {React.ReactNode} props.children - 자식 컴포넌트들
 * @returns {JSX.Element} - AppContext.Provider를 통해 상태를 제공하는 컴포넌트
 */
export const AppProvider = ({ children }) => {
  // roomId와 memberId 상태를 useState 훅을 사용하여 생성
  const [roomId, setRoomId] = useState(null);
  const [memberId, setMemberId] = useState(null);

  return (
    // AppContext.Provider를 사용하여 상태와 상태를 업데이트하는 함수를 제공
    <AppContext.Provider value={{ roomId, setRoomId, memberId, setMemberId }}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * AppContext를 사용하는 커스텀 훅
 *
 * @returns {object} - roomId, setRoomId, memberId, setMemberId를 포함하는 컨텍스트 값
 */
export const useAppContext = () => useContext(AppContext);
