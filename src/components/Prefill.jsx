import { useContext, useState } from "react";
import { GraphContext, NodeContext } from "../context/ContextProvider";
import { useNavigate } from "react-router";

import PrefillSidebar from "./PrefillSidebar";

// font awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

function Prefill() {
  const navigate = useNavigate();
  const [fieldName, setFieldName] = useState("");
  const [filled, setFilled] = useState(true);
  const { id, componentId, name } = useContext(NodeContext);
  const { graph } = useContext(GraphContext);

  if (!id) {
    navigate("/");
    return;
  }

  const form = graph?.forms.filter((f) => f.id === componentId)[0];
  const fields = Object.keys(form.field_schema.properties);
  const muted = filled ? "" : " text-muted";

  function handleClick(event) {
    const { target } = event;

    target.select();
    setFieldName(`${name}.${target.value}`);
  }

  function getParentNodes(formId) {
    // use the spread operator here to create a copy; otherwise, I'd modify the graph...data.prerequisites object directly
    let currentParents = [...graph.nodes.filter(f => f.id === formId)[0].data.prerequisites];
    let allParents = [];

    while (currentParents.length) {
      let currentId = currentParents.shift();
      if (!allParents.includes(currentId)) {
        allParents.push(currentId);
      }
      let nextParents = graph.nodes.filter(f => f.id === currentId)[0].data.prerequisites;
      currentParents = currentParents.concat(nextParents);
    }

    return allParents;
  }

  return (
    <>
      <div className="container">
        <h5>Prefill</h5>
        <p>Prefill fields for {name}.</p>
        <div>
          {fields.map((field) => (
            <div className="input-group position-relative mb-2 mt-3">
              {filled ? (
                ""
              ) : (
                <FontAwesomeIcon
                  icon={faDatabase}
                  style={{
                    position: "relative",
                    top: "11px",
                    left: "23px",
                    zIndex: 1,
                  }}
                />
              )}
              <input
                type="text"
                className={"form-control" + muted}
                onClick={handleClick}
                style={{
                  paddingLeft: filled ? ".75rem" : "30px",
                  backgroundColor: "rgb(233, 236, 239)",
                  borderRadius: filled ? "15px 0px 0px 15px" : "6px",
                }}
                value={field}
                disabled={filled || fieldName}
              />
              {filled ? (
                <button
                  type="button"
                  style={{
                    border: "1px solid rgb(222, 226, 230)",
                    borderLeftColor: "rgb(233, 236, 239)",
                    borderTopRightRadius: "15px",
                    borderBottomRightRadius: "15px",
                    zIndex: "1",
                    backgroundColor: "rgb(233, 236, 239)",
                    boxShadow: "0",
                  }}
                  onClick={() => setFilled(false)}
                >
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    size="lg"
                    style={{ color: "var(--bs-gray-500)" }}
                  />
                </button>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      </div>

      <PrefillSidebar fieldName={fieldName} setFieldName={setFieldName} />
    </>
  );
}

export default Prefill;
