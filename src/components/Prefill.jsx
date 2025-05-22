import { useContext, useState } from "react";
import { GraphContext, NodeContext } from "../context/ContextProvider";
import { useNavigate } from "react-router";

// font awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import PrefillSidebar from "./PrefillSidebar";

function Prefill() {
  const navigate = useNavigate();
  const [show, setShow] = useState("show");
  const { id, componentId, name } = useContext(NodeContext);
  const { graph } = useContext(GraphContext);

  if (!id) {
    navigate("/");
    return;
  }

  const form = graph?.forms.filter((f) => f.id === componentId)[0];
  const fields = Object.keys(form.field_schema.properties);

  return (
    <>
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
              style={{
                paddingLeft: "30px",
                backgroundColor: "rgb(233, 236, 239)",
              }}
              value={field}
            />
          </>
        ))}
      </div>
    </div>
    
    <PrefillSidebar show={show} setShow={setShow} />
    </>
  );
}

export default Prefill;
