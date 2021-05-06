import React from "react";
import * as d3 from "d3";
import Tree from "./Tree";

// TODO: for some reason, css modules are not working for components brought in as refs (e.g. D3 SVGs)
import "./style.scss";

const DecisionTree = ({ decisionTree, principalVariation }) => {
  if (!decisionTree) return <div>Loading...</div>;
  if (decisionTree.length === 0) return <div>Empty decision tree received</div>;

  const root = d3
    .stratify()
    .id((d) => d.id)
    .parentId((d) => d.parent)(decisionTree)
    .sort((a, b) => b.data.value - a.data.value);

  return (
    <div className="decision-tree">
      <Tree root={root} importantNodes={principalVariation} />
    </div>
  );
};

export default DecisionTree;
