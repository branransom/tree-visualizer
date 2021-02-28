import React, { useEffect, useState } from "react";
import axios from "axios";
import Tree from "./Tree";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(async () => {
    const result = await axios.get("http://localhost:5000/decision_tree");

    console.log(result);
    setData([{ id: "root" }, ...result.data]);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <Tree data={data} />
    </div>
  );
};

export default App;
