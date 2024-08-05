import React from "react";

import { Route, Routes } from "react-router-dom";
import "./styles/App.css";
import Home from "./pages/Home";
import MyPage from "./pages/user/MyPage";
import GamePages from "./routes/GamePages";
import UserPages from "./routes/UserPages";
import IceBreaking from "./pages/iceBreaking/IceBreaking";
import Loading from "./pages/iceBreaking/Loading";
import Intro from "./pages/iceBreaking/Intro";
import GameRecord from "./pages/games/GameRecord";
import RoomCreateModal from "./components/modals/RoomCreateModal";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/gameRecord" element={<GameRecord />} />
        <Route path="/user/*" element={<UserPages />} />
        <Route path="/icebreaking" element={<IceBreaking />}>
          <Route path="/icebreaking/games/*" element={<GamePages />} />
          <Route path="" element={<Loading />} />
          <Route path="intro" element={<Intro />} />
        </Route>
        <Route path="/create-room" element={<RoomCreateModal />} />
      </Routes>
    </div>
  );
}

export default App;
