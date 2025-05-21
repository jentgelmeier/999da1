import { useContext } from "react";
import { NodeContext } from "../context/nodeContext";
import { useNavigate } from "react-router";

// font awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";

function Prefill({ graph = {} }) {
  const navigate = useNavigate();
  const { id, componentId, name } = useContext(NodeContext);

  if (!id) {
    navigate("/");
    return;
  }

  const form = graph?.forms.filter((f) => f.id === componentId)[0];
  const fields = Object.keys(form.field_schema.properties);

  return (
    <div className="container">
      <h5>Prefill</h5>
      <p>Prefill fields for {name}.</p>
      <div>
        {fields.map((field) => (
          <>
            <FontAwesomeIcon
              icon={faDatabase}
              style={{ position: "relative", top: "32px", left: "10px" }}
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: "30px", backgroundColor: "rgb(233, 236, 239)" }}
              // style={{ paddingLeft: "30px" }}
              value={field}
              // disabled
            />
          </>
        ))}
      </div>
    </div>
  );
}

export default Prefill;
