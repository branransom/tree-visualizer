import React, { useState } from "react";
import * as d3 from "d3";
import Tree from "./Tree";
import MoveData from "./MoveData";
import PrincipalVariation from "./PrincipalVariation";

// TODO: for some reason, css modules are not working for components brought in as refs (e.g. D3 SVGs)
import "./style.scss";

const DecisionTree = ({ decisionTree, principalVariation }) => {
  if (!decisionTree) return <div>Loading...</div>;

  const [moveData, setMoveData] = useState();

  const handleNodeHover = (d) => {
    setMoveData(d.data);
  };

  const root = d3
    .stratify()
    .id((d) => d.id)
    .parentId((d) => d.parent)(decisionTree)
    .sort((a, b) => b.data.value - a.data.value);

  const collapse = (d) => {
    if (!d.children) {
      return;
    }

    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  };

  if (root.children) {
    root.children.forEach(collapse);
  }

  return (
    <div className="decision-tree">
      <Tree
        root={root}
        importantNodes={principalVariation}
        handleNodeHover={handleNodeHover}
      />
      <MoveData data={moveData} />
      <PrincipalVariation data={principalVariation} />
    </div>
  );
};

export default DecisionTree;
