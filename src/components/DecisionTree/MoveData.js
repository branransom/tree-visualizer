import React from "react";

const MoveData = ({ data }) => {
  if (!data) return null;

  const { name, value, alpha, beta, id, parent, is_white, zobrist } = data;

  return (
    <div className="move-data">
      <p>move: {name}</p>
      <p>value: {value}</p>
      <p>alpha: {alpha}</p>
      <p>beta: {beta}</p>
      <p>id: {id}</p>
      <p>parent: {parent}</p>
      <p>is_white: {String(is_white)}</p>
      <p>zobrist: {zobrist}</p>
    </div>
  );
};

export default MoveData;
