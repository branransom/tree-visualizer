import React from "react";
import Chessboard from "chessboardjsx";
import "./style.module.scss";

const ChessBoard = () => {
  return (
    <Chessboard position="2R5/4bppk/1p1p3Q/5R1P/4P3/5P2/r4q1P/7K b - - 6 50" />
  );
};

export default ChessBoard;
