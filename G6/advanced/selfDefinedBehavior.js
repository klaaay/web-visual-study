import G6 from "@antv/g6";
import React, { useEffect, useRef, useState } from "react";

G6.registerBehavior("click-add-node", {
  getEvents() {
    return {
      "canvas:click": "onClick",
    };
  },
  onClick(ev) {
    const graph = this.graph;
    const node = graph.addItem("node", {
      x: ev.x,
      y: ev.y,
      id: G6.Util.uniqueId(),
    });
    graph.setItemState(node, "selected", true); // 添加后默认选中
  },
});

G6.registerBehavior("click-add-edge", {
  getEvents() {
    return {
      "node:click": "onClick",
      mousemove: "onMousemove",
      "edge:click": "onEdgeClick", // 点击空白处，取消边
    };
  },
  onClick: function(ev) {
    const node = ev.item;
    const graph = this.graph;
    const point = {
      x: ev.x,
      y: ev.y,
    };
    const model = node.getModel();
    if (this.addingEdge && this.edge) {
      graph.updateItem(this.edge, {
        target: model.id,
      });
      // graph.setItemState(this.edge, 'selected', true);
      this.edge = null;
      this.addingEdge = false;
    } else {
      this.edge = graph.addItem("edge", {
        source: model.id,
        target: point,
      });
      this.addingEdge = true;
    }
  },
  onMousemove(ev) {
    const point = {
      x: ev.x,
      y: ev.y,
    };
    if (this.addingEdge && this.edge) {
      this.graph.updateItem(this.edge, {
        target: point,
      });
    }
  },
  onEdgeClick(ev) {
    const currentEdge = ev.item;
    // 拖拽过程中，点击会点击到新增的边上
    if (this.addingEdge && this.edge == currentEdge) {
      this.graph.removeItem(this.edge);
      this.edge = null;
      this.addingEdge = false;
    }
  },
});

const data = {
  nodes: [
    {
      id: "node1",
      x: 100,
      y: 200,
    },
    {
      id: "node2",
      x: 300,
      y: 200,
    },
    {
      id: "node3",
      x: 300,
      y: 300,
    },
  ],
  edges: [
    {
      id: "edge1",
      target: "node2",
      source: "node1",
    },
  ],
};

export const SelfDefinedBehavior = () => {
  const ref = useRef(null);

  const graphRef = useRef(null);

  useEffect(() => {
    graphRef.current = new G6.Graph({
      container: ref.current,
      width: 800,
      height: 600,
      modes: {
        default: ["drag-node", "click-select"],
        addNode: ["click-add-node", "click-select"],
        addEdge: ["click-add-edge", "click-select"],
      },
    });

    graphRef.current.data(data);
    graphRef.current.render();

    return () => {};
  }, [data]);

  return (
    <div>
      <select
        id="selector"
        onChange={e => {
          console.log(e.target.value);
          graphRef.current.setMode(e.target.value);
        }}>
        <option value="default">Default mode</option>
        <option value="addNode">Add Node (by clicking canvas)</option>
        <option value="addEdge">Add Edge (by clicking two end nodes)</option>
      </select>
      <div ref={ref}></div>;
    </div>
  );
};
