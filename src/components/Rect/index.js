import React, { useState, useEffect, useRef } from "react";
import { select } from "d3";

export default function RectHooks() {
  const [data, setData] = useState([5, 3, 6, 1, 2]);

  console.log("re-render");

  const svgRef = useRef();

  useEffect(() => {
    const svg = select(svgRef.current); // select svg ref

    svg
      .selectAll("rect")
      .data(data)
      .join(
        (enter) => enter.append("rect").attr("class", "new-element"),
        (update) => update.attr("class", "updated-element"),
        (exit) => exit.transition().attr("width", 0).attr("height", 0).remove()
      )
      .transition()
      .duration(1000)
      .attr("width", (value) => value * 10)
      .attr("height", 50)
      .attr("x", (value) => value + 10)
      .attr("y", (value) => (value * value) / 2)
      .attr("stroke", "red")
      .attr("stroke-width", "3")
      .attr("fill", "transparent");
  }, [data]);

  const update = () => {
    const newData = data.map((value) => value + 5);
    setData(newData);
  };

  const removeLast = () => {
    const newData = [...data];
    newData.pop();
    setData(newData);
  };

  return (
    <div style={{ border: "2px solid black", padding: "10px", width: "300px" }}>
      <svg ref={svgRef}></svg>
      <br />
      <button onClick={update}>Update</button>
      <br />
      <button onClick={removeLast}>Remove</button>
    </div>
  );
}
