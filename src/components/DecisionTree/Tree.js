import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { cloneDeep } from "lodash";
import useResizeObserver from "../../hooks/useResizeObserver";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Tree = ({ root: data, importantNodes, handleNodeHover }) => {
  if (!data) return null;

  // useRef returns a mutable object, which persists across render events.
  // Think of it as an instance variable
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const [root, setRoot] = useState(data);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const { width: boundingWidth, height: boundingHeight } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    const margin = { top: 30, right: 20, bottom: 30, left: 20 };
    const height = boundingHeight - margin.top - margin.bottom;
    const width = boundingWidth - margin.right - margin.left;

    const treeLayout = d3.tree().size([height, width]);

    const linkGenerator = d3
      .linkHorizontal()
      .x((link) => link.y)
      .y((link) => link.x);

    // enrich hierarchical data with coordinates
    treeLayout(root);

    console.warn("descendants", root.descendants());
    console.warn("links", root.links());

    svg
      .selectAll(".node")
      .data(root.descendants())
      .join(
        (enter) => enter.append("circle").attr("opacity", 0),
        (update) => update,
        (exit) =>
          exit
            .transition()
            .duration(300)
            .attr("r", 0)
            .style("opacity", 0)
            .remove()
      )
      .attr("class", "node")
      .on("click", (event, d) => {
        click(d);
      })
      .attr("cx", (node) => node.y)
      .attr("cy", (node) => node.x)
      .attr("r", 3)
      .on("mouseover", (event, d) => {
        handleNodeHover(d);
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

    svg
      .selectAll(".link")
      .data(root.links())
      .join(
        (enter) => {
          return enter.append("path").attr("opacity", 1);
        },
        (update) => {
          return update;
        },
        (exit) => {
          return exit.transition().duration(300).attr("opacity", 0).remove();
        }
      )
      .attr("class", "link")
      .attr("d", linkGenerator)
      .attr("stroke-dasharray", function () {
        const length = this.getTotalLength();
        return `${length} ${length}`;
      })
      .attr("stroke", "black")
      .attr("fill", "none");

    svg
      .selectAll(".label")
      .data(root.descendants())
      .join(
        (enter) => enter.append("text").attr("opacity", 1),
        (update) => {
          return update;
        },
        (exit) => {
          return exit.transition().duration(300).attr("opacity", 0).remove();
        }
      )
      .attr("class", "label")
      .attr("x", (node) => node.y)
      .attr("y", (node) => node.x - 12)
      .text((node) => node.data.name)
      .transition()
      .duration(500)
      .delay((node) => node.depth * 300)
      .attr("opacity", 1);
  }, [root]);

  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }

    setRoot(cloneDeep(root));
  }

  return (
    <div className="tree-container" ref={wrapperRef}>
      <svg ref={svgRef} className="tree"></svg>
    </div>
  );
};

export default Tree;
