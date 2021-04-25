import React from "react";
import Chessboard from "chessboardjsx";
import "./style.module.scss";

const ChessBoard = ({ position, handleMove }) => {
  const handlePieceDrop = ({ sourceSquare, targetSquare }) => {
    handleMove({ sourceSquare, targetSquare });
  };

  return <Chessboard position={position} onDrop={handlePieceDrop} />;
};

export default ChessBoard;
