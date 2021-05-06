import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "../../hooks/useResizeObserver";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Tree = ({ root: data, importantNodes }) => {
  if (!data) return null;

  // useRef returns a mutable object, which persists across render events.
  // Think of it as an instance variable
  const rootRef = useRef(data);
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // we save data to see if it changed
  const previouslyRenderedData = usePrevious(data);

  //const { width, height } =
  //  dimensions || wrapperRef.current.getBoundingClientRect();
  //
  console.log("re-render", root);

  const width = 800;
  const height = 900;

  useEffect(() => {
    console.log("useEffect");
    update();
  }, []);

  const update = () => {
    console.log(rootRef);
    const svg = d3.select(svgRef.current);
    const root = rootRef.current;
    const treeLayout = d3.tree().size([height, width]);

    const linkGenerator = d3
      .linkHorizontal()
      .x((link) => link.y)
      .y((link) => link.x);

    // TODO: prevent multiple tooltips from being created due to re-renders
    const tooltip = d3
      .select("#container")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // enrich hierarchical data with coordinates
    treeLayout(root);

    console.warn("descendants", root.descendants());
    console.warn("links", root.links());

    // nodes
    // TODO: Why are all nodes exiting on click? This is causing the entire tree to re-render
    svg
      .selectAll(".node")
      .data(root.descendants())
      .join(
        (enter) => {
          console.log("on enter", enter);
          return enter
            .append("circle")
            .attr("class", "node")
            .on("click", (event, d) => {
              console.log(d);
              click(d);
              //setRoot(cloneDeep(root));
              //toggleChildren(root);
            })
            .attr("opacity", 0);
        },
        (update) => {
          console.log("on update", update);
          return update;
        },
        (exit) => {
          console.log("on exit", exit);
          return exit
            .transition()
            .duration(300)
            .attr("r", 0)
            .style("opacity", 0)
            .remove();
          //.attr("cx", 1000)
          //.on("end", function () {
          //  d3.select(this).remove();
          //});
        }
      )
      //.attr("class", "node")
      .attr("cx", (node) => node.y)
      .attr("cy", (node) => node.x)
      .attr("r", 4)
      .on("mouseover", (event, d) => {
        tooltip.html(`
          alpha: ${d.data.alpha}<br/>
          beta: ${d.data.beta}<br/>
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
  };

  function click(d) {
    console.log("on click", d);
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(root);
  }

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
