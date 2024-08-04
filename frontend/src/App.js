// App.js
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
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/mypage"
          element={
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/gameRecord"
          element={
            <PrivateRoute>
              <GameRecord />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/*"
          element={
            <PrivateRoute>
              <UserPages />
            </PrivateRoute>
          }
        />
        <Route
          path="/icebreaking"
          element={
            <PrivateRoute>
              <IceBreaking />
            </PrivateRoute>
          }
        >
          <Route
            path="/icebreaking/games/*"
            element={
              <PrivateRoute>
                <GamePages />
              </PrivateRoute>
            }
          />
          <Route
            path=""
            element={
              <PrivateRoute>
                <Loading />
              </PrivateRoute>
            }
          />
          <Route
            path="intro"
            element={
              <PrivateRoute>
                <Intro />
              </PrivateRoute>
            }
          />
        </Route>
        <Route
          path="/create-room"
          element={
            <PrivateRoute>
              <RoomCreateModal />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
