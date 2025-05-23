import { useContext } from "react";
import { useNavigate } from "react-router";
import { NodeContext } from "../context/ContextProvider";
import { Graph, NodeContextType, Node } from "../types";

function NodeList({ graph }: { graph: Partial<Graph> }) {
  const navigate = useNavigate();
  const { setNodeId, setComponentId, setName } =
    useContext<NodeContextType>(NodeContext);

  const { nodes = [] } = graph;

  function azSort(a: Node, b: Node) {
    if (a.data?.name < b.data?.name) {
      return -1;
    }
    if (a.data?.name > b.data?.name) {
      return 1;
    }
    return 0;
  }

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    setName((e.target as HTMLButtonElement).innerText);
    setNodeId((e.target as HTMLButtonElement).value);
    setComponentId(
      (e.target as HTMLButtonElement).getAttribute("data-componentid") || ""
    );
    navigate("/prefill");
  }

  return (
    <div className="container my-auto">
      {nodes.sort(azSort).map((node: Node) => {
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
