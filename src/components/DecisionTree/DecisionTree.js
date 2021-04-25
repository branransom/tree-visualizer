import React from "react";
import Tree from "./Tree";

// TODO: for some reason, css modules are not working for components brought in as refs (e.g. D3 SVGs)
import "./style.scss";

const DecisionTree = ({ decisionTree }) => {
  if (!decisionTree) return <div>Loading...</div>;

  return (
    <div className="decision-tree">
      <Tree data={decisionTree} />
    </div>
  );
};

export default DecisionTree;
