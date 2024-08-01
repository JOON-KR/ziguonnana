import React from "react";
import { Route, Routes } from "react-router-dom";

import Community from "../pages/user/Community";
import MyPage from "../pages/user/MyPage";
import ProfilePick from "../pages/user/ProfilePick";
import SocketTest from "../pages/SocketTest";

const UserPages = () => {
  return (
    <div>
      <Routes>
        <Route path="community" element={<Community />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="profilePick" element={<ProfilePick />} />
        <Route path="socketTest" element={<SocketTest />} />
      </Routes>
    </div>
  );
};

export default UserPages;
