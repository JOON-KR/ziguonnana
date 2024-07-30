import React from "react";
import { Route, Routes } from "react-router-dom";
import Games from "../pages/games/Games";
import Game1 from "../pages/games/Game1";
import Game2 from "../pages/games/Game2";
import Game3 from "../pages/games/Game3";
import Game4 from "../pages/games/Game4";
import Game5 from "../pages/games/Game5";
import GameRecord from "../pages/games/GameRecord";
import GameRecordDetail from "../pages/games/GameRecordDetail";

const GamePages = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Games />} />
        <Route path="game1" element={<Game1 />} />
        <Route path="game2" element={<Game2 />} />
        <Route path="game3" element={<Game3 />} />
        <Route path="game4" element={<Game4 />} />
        <Route path="game5" element={<Game5 />} />
        <Route path="gameRecord" element={<GameRecord />} />
        <Route path="gameRecordDetail" element={<GameRecordDetail />} />
      </Routes>
    </div>
  );
};

export default GamePages;
