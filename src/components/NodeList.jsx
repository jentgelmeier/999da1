import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { NodeContext } from "../context/nodeContext";

function NodeList({ graph }) {
  const navigate = useNavigate();
  const { setId, setComponentId, setName } = useContext(NodeContext);

  const { nodes = [] } = graph;

  function azSort(a, b) {
    if (a.data.name < b.data.name) {
      return -1;
    }
    if (a.data.name > b.data.name) {
      return 1;
    }
    return 0;
  }

  function handleClick(e) {
    setName(e.target.innerText);
    setId(e.target.value);
    setComponentId(e.target.getAttribute("data-componentid"));
    navigate("/prefill")
  }

  return (
    <div className="container my-auto">
      {nodes.sort(azSort).map((node) => {
        return (
          <div key={node.id} className="card my-1">
            <div className="card-body">
              <button className="btn btn-link" value={node.id} data-componentid={node.data.component_id} onClick={handleClick}>{node.data.name}</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default NodeList;
