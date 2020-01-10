import G6 from "@antv/g6";
import React, { useEffect, useRef } from "react";

const data = {
  nodes: [
    {
      id: "node0",
      x: 100,
      y: 100,
      size: 20,
    },
    {
      id: "node1",
      x: 200,
      y: 200,
      size: 20,
    },
    {
      id: "node2",
      x: 150,
      y: 150,
      size: 20,
    },
    {
      id: "node3",
      x: 150,
      y: 250,
      size: 20,
    },
    {
      id: "node4",
      x: 150,
      y: 200,
      size: 20,
    },
  ],
  edges: [
    {
      id: "edge0",
      source: "node0",
      target: "node1",
    },
    {
      id: "edge1",
      source: "node2",
      target: "node3",
    },
  ],
};

export const LevelGroupChange = () => {
  const ref = useRef(null);

  useEffect(() => {
    const graph = new G6.Graph({
      container: ref.current,
      width: 800,
      height: 600,
      // 确定分组层级
      groupByTypes: false,
      defaultEdge: {
        style: {
          lineWidth: 2,
        },
      },
    });

    graph.data(data);
    graph.render();

    // 获取图上的所有边实例
    const nodes = graph.getNodes();

    // 遍历边实例，将所有边提前。
    nodes.forEach(node => {
      node.toFront();
    });

    // 更改层级后需要重新绘制图
    graph.paint();

    // 鼠标进入节点事件
    graph.on("edge:mouseenter", ev => {
      // 获得鼠标当前目标边
      const edge = ev.item;
      // 该边的起始点
      const source = edge.getSource();
      // 该边的结束点
      const target = edge.getTarget();
      // 先将边提前，再将端点提前。这样该边两个端点还是在该边上层，较符合常规。
      edge.toFront();
      source.toFront();
      target.toFront();
      // 注意：必须调用以根据新的层级顺序重绘
      graph.paint();
    });

    graph.on("edge:mouseleave", ev => {
      // 获得图上所有边实例
      const edges = graph.getEdges();
      // 遍历边，将所有边的层级放置在后方，以恢复原样
      edges.forEach(edge => {
        edge.toBack();
      });
      // 注意：必须调用以根据新的层级顺序重绘
      graph.paint();
    });

    graph.on("node:mouseenter", ev => {
      // 获得鼠标当前目标节点
      const node = ev.item;
      // 获取该节点的所有相关边
      const edges = node.getEdges();
      // 遍历相关边，将所有相关边提前，再将相关边的两个端点提前，以保证相关边的端点在边的上方常规效果
      edges.forEach(edge => {
        edge.toFront();
        edge.getSource().toFront();
        edge.getTarget().toFront();
      });
      // 注意：必须调用以根据新的层级顺序重绘
      graph.paint();
    });

    graph.on("node:mouseleave", ev => {
      // 获得图上所有边实例
      const edges = graph.getEdges();
      // 遍历边，将所有边的层级放置在后方，以恢复原样
      edges.forEach(edge => {
        edge.toBack();
      });
      // 注意：必须调用以根据新的层级顺序重绘
      graph.paint();
    });

    // 鼠标点击节点，隐藏该节点
    graph.on("node:click", ev => {
      const node = ev.item;
      console.log("before hide(), the nodevisible = ", node.get("visible"));
      node.hide();
      graph.paint();
      console.log("after hide(), the node visible = ", node.get("visible"));
    });

    // 鼠标点击边，隐藏该边
    graph.on("edge:click", ev => {
      const edge = ev.item;
      console.log("before hide(), the edge visible = ", edge.get("visible"));
      edge.hide();
      graph.paint();
      console.log("after hide(), the edge visible = ", edge.get("visible"));
    });

    // 鼠标点击画布，显示所有节点和边
    graph.on("canvas:click", ev => {
      const nodes = graph.getNodes();
      const edges = graph.getEdges();
      nodes.forEach(node => {
        node.show();
      });
      edges.forEach(edge => {
        edge.show();
      });
      graph.paint();
    });

    return () => {};
  }, [data]);

  return <div ref={ref}></div>;
};
