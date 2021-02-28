import axios from "axios";
import unflatten from "./unflatten";

// ************** Generate the tree diagram	 *****************
const margin = { top: 20, right: 120, bottom: 20, left: 120 };
const width = 1500 - margin.right - margin.left;
const height = 1500 - margin.top - margin.bottom;

let i = 0;
let duration = 750;
let root;

const tree = d3.layout.tree().size([height, width]);

const diagonal = d3.svg.diagonal().projection(function (d) {
  return [d.y, d.x];
});

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const draw = async () => {
  const { data } = await axios.get("http://localhost:5000/decision_tree");

  root = unflatten(data)[0];
  root.x0 = height / 2;
  root.y0 = 0;

  console.log(root);

  update(root);

  d3.select(self.frameElement).style("height", "500px");
};

function update(source) {
  // Compute the new tree layout.
  const nodes = tree.nodes(root).reverse();
  const links = tree.links(nodes);
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Normalize for fixed-depth.
  nodes.forEach(function (d) {
    d.y = d.depth * 180;
  });

  // Update the nodes…
  const node = svg.selectAll("g.node").data(nodes, function (d) {
    return d.id || (d.id = ++i);
  });

  // Enter any new nodes at the parent's previous position.
  const nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .style("color", function (d) {
      if (d.is_white) {
        return "white";
      } else {
        return "black";
      }
    })
    .on("click", click)
    .on("mouseover", function (d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(
          `
            <p>α: ${d.alpha}</p>
            <p>β: ${d.beta}</p>
            <p>value: ${d.value}</p>
          `
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition(500).style("opacity", 0);
    });

  nodeEnter
    .append("circle")
    .attr("r", 1e-6)
    .style("fill", function (d) {
      return d._children ? "lightsteelblue" : "#fff";
    });

  nodeEnter
    .append("text")
    .attr("x", function (d) {
      return d.children || d._children ? -13 : 13;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", function (d) {
      return d.children || d._children ? "end" : "start";
    })
    .text(function (d) {
      return d.name;
    })
    .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  const nodeUpdate = node
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  nodeUpdate
    .select("circle")
    .attr("r", 10)
    .style("fill", function (d) {
      if (d._children) {
        return "lightsteelblue";
      } else if (d.is_white === undefined) {
        return "green";
      } else if (d.is_white) {
        return "white";
      } else {
        return "black";
      }
    });

  nodeUpdate.select("text").style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  const nodeExit = node
    .exit()
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  nodeExit.select("circle").attr("r", 1e-6);

  nodeExit.select("text").style("fill-opacity", 1e-6);

  // Update the links…
  const link = svg.selectAll("path.link").data(links, function (d) {
    return d.target.id;
  });

  // Enter any new links at the parent's previous position.
  link
    .enter()
    .insert("path", "g")
    .attr("class", "link")
    .attr("d", function (d) {
      const o = { x: source.x0, y: source.y0 };
      return diagonal({ source: o, target: o });
    });

  // Transition links to their new position.
  link.transition().duration(duration).attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link
    .exit()
    .transition()
    .duration(duration)
    .attr("d", function (d) {
      const o = { x: source.x, y: source.y };
      return diagonal({ source: o, target: o });
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

draw();
