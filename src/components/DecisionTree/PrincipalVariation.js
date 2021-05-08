import React from "react";

const PrincipalVariation = ({ data }) => {
  return (
    <div className="principal-variation">
      <em>Principal Variation</em>
      {data.map(({ move }) => (
        <p>{move}</p>
      ))}
    </div>
  );
};

export default PrincipalVariation;
