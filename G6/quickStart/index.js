import G6 from "@antv/g6";
import React, { useEffect, useRef } from "react";
import ReactDom from "react-dom";

const data = {
  nodes: [
    {
      id: "node1",
      label: "Circle",
      x: 100,
      y: 100,
    },
    {
      id: "node2",
      label: "Circle2",
      x: 450,
      y: 100,
    },
  ],
  edges: [
    {
      source: "node1",
      target: "node2",
    },
  ],
};
export const QuickStart = () => {
  const ref = useRef(null);
  let graph = null;

  useEffect(() => {
    if (!graph) {
      graph = new G6.Graph({
        container: ref.current,
        width: 600,
        height: 600,
        defaultNode: {
          shape: "circle",
          size: [100],
          color: "#5B8FF9",
          style: {
            fill: "#9EC9FF",
            lineWidth: 3,
          },
          labelCfg: {
            style: {
              fill: "#fff",
              fontSize: 20,
            },
          },
        },
        defaultEdge: {
          style: {
            stroke: "#e2e2e2",
          },
        },
      });
    }
    graph.data(data);
    graph.render();
    return () => {};
  }, [data, graph]);

  return <div ref={ref}></div>;
};
