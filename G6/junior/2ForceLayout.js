import G6 from "@antv/g6";
import React, { useEffect, useRef } from "react";

export const ForceLayout = () => {
  const ref = useRef(null);

  const main = async graph => {
    const response = await fetch(
      "https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json",
    );
    const remoteData = await response.json();

    const nodes = remoteData.nodes;
    const edges = remoteData.edges;

    nodes.forEach(node => {
      if (!node.style) {
        node.style = {};
      }
      node.style.lineWidth = 1;
      node.style.stroke = "#666";
      node.style.fill = "steelblue";
      switch (node.class) {
        case "c0": {
          node.shape = "circle";
          break;
        }
        case "c1": {
          node.shape = "rect";
          node.size = [35, 20];
          break;
        }
        case "c2": {
          node.shape = "ellipse";
          node.size = [35, 20];
          break;
        }
      }
    });

    edges.forEach(edge => {
      if (!edge.style) {
        edge.style = {};
      }
      edge.style.lineWidth = edge.weight;
      edge.style.opacity = 0.6;
      edge.style.stroke = "grey";
    });

    graph.data(remoteData);
    graph.render();
  };

  useEffect(() => {
    const graph = new G6.Graph({
      container: ref.current,
      width: 1000,
      height: 600,
      renderer: "svg",
      // fitView: true,
      // fitViewPadding: [20, 40, 50, 20],
      defaultNode: {
        size: 30,
        labelCfg: {
          style: {
            fill: "#fff",
          },
        },
      },
      defaultEdge: {
        labelCfg: {
          autoRotate: true,
        },
      },
      layout: {
        type: "force", // 设置布局算法为 force
        linkDistance: 100, // 设置边长为 100
        preventOverlap: true, // 设置防止重叠
      },
    });
    main(graph);
    return () => {};
  }, []);

  return <div ref={ref}></div>;
};
