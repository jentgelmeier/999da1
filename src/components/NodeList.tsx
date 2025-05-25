import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";

import { GraphContext, NodeContext } from "../context/ContextProvider";

import { NodeContextType, Node } from "../types";
import { fetchGraph, nodeSort } from "../utils";

function NodeList() {
  const navigate = useNavigate();
  const { graph, setGraph } = useContext(GraphContext);
  const { setNodeId, setComponentId, setName } =
    useContext<NodeContextType>(NodeContext);

  useEffect(() => {
    fetchGraph().then((data) => {
      setGraph(data);
    });
  }, []);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    setName((e.target as HTMLButtonElement).innerText);
    setNodeId((e.target as HTMLButtonElement).value);
    setComponentId(
      (e.target as HTMLButtonElement).getAttribute("data-componentid") || ""
    );
    navigate("/prefill");
  }

  return (
    <div className="container center">
      {graph?.nodes?.sort(nodeSort).map((node: Node) => {
        return (
          <div key={node.id} className="card my-1">
            <div className="card-body">
              <button
                className="btn btn-link"
                value={node.id}
                data-componentid={node.data.component_id}
                onClick={handleClick}
              >
                {node.data.name}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default NodeList;
