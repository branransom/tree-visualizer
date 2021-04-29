import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import useResizeObserver from "../../hooks/useResizeObserver";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Tree = ({ data }) => {
  if (!data || data.length === 0) return null;

  // useRef returns a mutable object, which persists across render events.
  // Think of it as an instance variable
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // we save data to see if it changed
  const previouslyRenderedData = usePrevious(data);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    const root = d3
      .stratify()
      .id((d) => d.id)
      .parentId((d) => d.parent)(data)
      .sort((a, b) => b.data.value - a.data.value);

    const treeLayout = d3.tree().size([height, width]);

    const linkGenerator = d3
      .linkHorizontal()
      .x((link) => link.y)
      .y((link) => link.x);

    // enrich hierarchical data with coordinates
    treeLayout(root);

    console.warn("descendants", root.descendants());
    console.warn("links", root.links());

    const tooltip = d3
      .select("#container")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // nodes
    svg
      .selectAll(".node")
      .data(root.descendants())
      .join((enter) => enter.append("circle").attr("opacity", 0))
      .attr("class", "node")
      .attr("cx", (node) => node.y)
      .attr("cy", (node) => node.x)
      .attr("r", 4)
      .on("mouseover", (event, d) => {
        tooltip.text(`
          alpha: ${d.data.alpha}\n
          beta: ${d.data.beta}\n
          value: ${d.data.value}
        `);
        tooltip
          .transition()
          .duration(50)
          .style("opacity", 1)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .on("click", (event, d) => {
        console.log(d);
      })
      .transition()
      .duration(500)
      .delay((node) => node.depth * 300)
      .attr("opacity", 1)
      .attr("r", 10)
      .style("fill", (d) => {
        if (d.data.is_white === undefined) {
          return "green";
        }

        if (d.data.is_white) {
          return "white";
        }

        return "black";
      });

    // links
    const enteringAndUpdatingLinks = svg
      .selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("d", linkGenerator)
      .attr("stroke-dasharray", function () {
        const length = this.getTotalLength();
        return `${length} ${length}`;
      })
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("opacity", 1);

    if (data !== previouslyRenderedData) {
      enteringAndUpdatingLinks
        .attr("stroke-dashoffset", function () {
          return this.getTotalLength();
        })
        .transition()
        .duration(500)
        .delay((link) => link.source.depth * 500)
        .attr("stroke-dashoffset", 0);
    }

    // labels
    svg
      .selectAll(".label")
      .data(root.descendants())
      .join((enter) => enter.append("text").attr("opacity", 0))
      .attr("class", "label")
      .attr("x", (node) => node.y)
      .attr("y", (node) => node.x - 12)
      .text((node) => node.data.name)
      .transition()
      .duration(500)
      .delay((node) => node.depth * 300)
      .attr("opacity", 1);
  }, [data, dimensions, previouslyRenderedData]);

  return (
    <div className="tree" ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg
        ref={svgRef}
        style={{
          display: "block",
          overflow: "visible",
          height: "80vh",
          width: "100%",
        }}
      ></svg>
    </div>
  );
};

export default Tree;
