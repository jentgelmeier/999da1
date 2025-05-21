import { useState } from "react";

function NodeList({ graph }) {
  const { nodes = [] } = graph;

  console.log(nodes);

  function azSort(a, b) {
    if (a.data.name < b.data.name) {
      return -1;
    }
    if (a.data.name > b.data.name) {
      return 1;
    }

    return 0;
  }

  return (
    <div className="container my-auto">
      {nodes.sort(azSort).map((node) => {
        return (
          <div className="card my-1">
            <div className="card-body">{node.data.name}</div>
          </div>
        );
      })}
    </div>
  );
}

export default NodeList;
