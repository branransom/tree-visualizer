import React, { useEffect, useState } from "react";
import Tree from "./Tree";

// TODO: for some reason, css modules are not working for components brought in as refs (e.g. D3 SVGs)
import "./style.scss";

const DecisionTree = ({ decisionTree, principalVariation }) => {
  if (!decisionTree) return <div>Loading...</div>;

  const [data, setData] = useState([]);

  useEffect(() => {
    setData(decisionTree);
  }, [decisionTree]);

  const toggleChildren = (id) => {
    const updatedData = data.map((d) => {
      if (d.id !== id) {
        return d;
      }

      return {
        ...d,
        hideChildren: !d.hideChildren,
      };
    });

    setData(updatedData);
  };

  return (
    <div className="decision-tree">
      <Tree
        data={data}
        importantNodes={principalVariation}
        toggleChildren={toggleChildren}
      />
    </div>
  );
};

export default DecisionTree;
