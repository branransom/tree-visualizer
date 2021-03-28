import React, { useEffect, useState } from "react";
import axios from "axios";
import Tree from "./Tree";

// TODO: for some reason, css modules are not working for components brought in as refs (e.g. D3 SVGs)
import "./style.scss";

const DecisionTree = () => {
  const [data, setData] = useState([]);

  useEffect(async () => {
    const result = await axios.get("http://localhost:5000/decision_tree");

    setData([{ id: "root" }, ...result.data]);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="decision-tree">
      <Tree data={data} />
    </div>
  );
};

export default DecisionTree;
