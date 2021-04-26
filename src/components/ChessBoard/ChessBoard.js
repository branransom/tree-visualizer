import React from "react";
import Chessboard from "chessboardjsx";
import "./style.module.scss";

const ChessBoard = ({ position, handleMove, handleReset }) => {
  console.log(position);

  const handlePieceDrop = ({ sourceSquare, targetSquare }) => {
    handleMove({ sourceSquare, targetSquare });
  };

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Chessboard position={position} onDrop={handlePieceDrop} />
    </>
  );
};

export default ChessBoard;
