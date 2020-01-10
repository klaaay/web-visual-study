import G6 from "@antv/g6";
import React, { useEffect, useRef } from "react";

export const ForceLayoutBehavior = () => {
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

    // 监听鼠标进入节点
    graph.on("node:mouseenter", e => {
      const nodeItem = e.item;
      // 设置目标节点的 hover 状态 为 true
      graph.setItemState(nodeItem, "hover", true);
    });

    // 监听鼠标离开节点
    graph.on("node:mouseleave", e => {
      const nodeItem = e.item;
      // 设置目标节点的 hover 状态 false
      graph.setItemState(nodeItem, "hover", false);
    });

    // 监听鼠标点击节点
    graph.on("node:click", e => {
      // 先将所有当前有 click 状态的节点的 click 状态置为 false
      const clickNodes = graph.findAllByState("node", "click");
      clickNodes.forEach(cn => {
        graph.setItemState(cn, "click", false);
      });
      const nodeItem = e.item;
      // 设置目标节点的 click 状态 为 true
      graph.setItemState(nodeItem, "click", true);
    });

    // 监听鼠标点击节点
    graph.on("edge:click", e => {
      // 先将所有当前有 click 状态的边的 click 状态置为 false
      const clickEdges = graph.findAllByState("edge", "click");
      clickEdges.forEach(ce => {
        graph.setItemState(ce, "click", false);
      });
      const edgeItem = e.item;
      // 设置目标边的 click 状态 为 true
      graph.setItemState(edgeItem, "click", true);
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
      // 节点在各状态下的样式
      nodeStateStyles: {
        // hover 状态为 true 时的样式
        hover: {
          fill: "lightsteelblue",
        },
        // click 状态为 true 时的样式
        click: {
          stroke: "#000",
          lineWidth: 3,
        },
      },
      // 边在各状态下的样式
      edgeStateStyles: {
        // click 状态为 true 时的样式
        click: {
          stroke: "steelblue",
        },
      },
      layout: {
        type: "force", // 设置布局算法为 force
        linkDistance: 100, // 设置边长为 100
        preventOverlap: true, // 设置防止重叠
        nodeStrength: -30,
        edgeStrength: 0.1,
      },
      // 内置交互
      modes: {
        default: ["drag-canvas", "zoom-canvas", "drag-node"],
      },
    });
    main(graph);
    return () => {};
  }, []);

  return <div ref={ref}></div>;
};
