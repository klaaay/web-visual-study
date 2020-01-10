import G6 from "@antv/g6";
import React, { useState, useEffect, useRef } from "react";

export const RemoteData = () => {
  const ref = useRef(null);

  const main = async graph => {
    const response = await fetch(
      "https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json",
    );
    const remoteData = await response.json();
    graph.data(remoteData);
    graph.render();
  };

  useEffect(() => {
    const graph = new G6.Graph({
      container: ref.current,
      width: 1000,
      height: 600,
      renderer: "svg",
      fitView: true,
      fitViewPadding: [20, 40, 50, 20],
    });
    main(graph);
    return () => {};
  }, []);

  return <div ref={ref}></div>;
};
