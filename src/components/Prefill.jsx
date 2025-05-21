import { useContext } from "react";
import { NodeContext } from "../context/nodeContext";
import { useNavigate } from "react-router";

function Prefill({ graph = {} }) {
  const navigate = useNavigate();
  const { id, componentId, name } = useContext(NodeContext);

  if (!id) {
    navigate("/");
    return;
  }

  const form = graph?.forms.filter((f) => f.id === componentId)[0];
  console.log(form);

  return <div className="container">{name}</div>;
}

export default Prefill;
