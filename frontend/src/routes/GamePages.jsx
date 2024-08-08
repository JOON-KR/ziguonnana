import React from "react";
import { Route, Routes } from "react-router-dom";
import Games from "../pages/games/Games";
import Game1 from "../pages/games/Game1";
import Game1Drawing from "../pages/games/Game1Drawing";
import Game1Nickname from "../pages/games/Game1Nickname";
import Game1Result from "../pages/games/Game1Result";
import Game1Avata from "../pages/games/Game1Avata";
import Game2 from "../pages/games/Game2";
import Game3 from "../pages/games/Game3";
import Game4 from "../pages/games/Game4";
import Game5 from "../pages/games/Game5";
import Game5Dance from "../pages/games/Game5Dance";
import Game5TeamIntro from "../pages/games/Game5TeamIntro";
import GameRecord from "../pages/games/GameRecord";
import GameRecordDetail from "../pages/games/GameRecordDetail";

const GamePages = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Games />} />
        <Route path="game1" element={<Game1 />} />
        <Route path="game1Drawing" element={<Game1Drawing />} />
        <Route path="game1NickName" element={<Game1Nickname />} />
        <Route path="game1Result" element={<Game1Result />} />
        <Route path="game1Avata" element={<Game1Avata />} />
        <Route path="game2" element={<Game2 />} />
        <Route path="game3" element={<Game3 />} />
        <Route path="game4" element={<Game4 />} />
        <Route path="game5" element={<Game5 />} />
        <Route path="Game5Dance" element={<Game5Dance />} />
        <Route path="Game5TeamIntro" element={<Game5TeamIntro />} />
        <Route path="gameRecord" element={<GameRecord />} />
        <Route path="gameRecordDetail" element={<GameRecordDetail />} />
      </Routes>
    </div>
  );
};

export default GamePages;
