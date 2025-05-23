/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useState } from "react";
import {
  GraphContext,
  NodeContext,
  PrefillContext,
} from "../context/ContextProvider";
import { useNavigate } from "react-router";

import PrefillSidebar from "./PrefillSidebar";

// font awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

function Prefill() {
  const navigate = useNavigate();

  const [fieldName, setFieldName] = useState("");
  const [fields, setFields] = useState<string[]>([]);
  const [parentNodes, setParentNodes] = useState<string[]>([]);

  const { nodeId, componentId, name } = useContext(NodeContext);
  const { graph } = useContext(GraphContext);
  const { prefill, setPrefill } = useContext(PrefillContext);

  useEffect(() => {
    if (!nodeId) {
      navigate("/");
      return;
    }
    // retrieve fields to display
    const form = graph?.forms.filter((f) => f.id === componentId)[0];
    setFields(Object.keys(form?.field_schema.properties));

    // get parent nodes for sidebar
    setParentNodes(getParentNodes(nodeId));
  }, []);

  function handleClick(event) {
    const { target } = event;

    target.select();
    setFieldName(`${name}.${target.value}`);
  }

  function getParentNodes(formId: string): string[] {
    // use the spread operator here to create a copy; otherwise, I'd modify the graph...data.prerequisites object directly
    let currentParents = [
      ...graph.nodes.filter((f) => f.id === formId)[0].data.prerequisites,
    ];
    let allParents = [];

    while (currentParents.length) {
      let currentId = currentParents.shift();
      if (!allParents.includes(currentId)) {
        allParents.push(currentId);
      }
      let nextParents = graph.nodes.filter((f) => f.id === currentId)[0].data
        .prerequisites;
      currentParents = currentParents.concat(nextParents);
    }

    return allParents;
  }

  function handleFieldClear(event) {
    let { target } = event;
    let { id } = target;

    // only button has an id, so loop through parent elements until the button id is selected
    while (!id) {
      target = target.parentElement;
      id = target.id;
    }

    const prefillCopy = { ...prefill };
    prefillCopy[nodeId][id] = "";
    setPrefill(prefillCopy);
  }

  return (
    <>
      <div className="container">
        <h5>Prefill</h5>
        <p>Prefill fields for {name}.</p>
        <div>
          {fields.map((field) => (
            <div
              key={field}
              className="input-group position-relative mb-2 mt-3"
            >
              {prefill[nodeId][field] ? (
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
                className={
                  prefill[nodeId][field]
                    ? "form-control"
                    : "form-control text-muted"
                }
                onClick={handleClick}
                onChange={() => {}} //added onChange to remove React console error
                style={{
                  marginLeft: prefill[nodeId][field] ? "14px" : "",
                  paddingLeft: prefill[nodeId][field] ? ".75rem" : "30px",
                  backgroundColor: "rgb(233, 236, 239)",
                  borderRadius: prefill[nodeId][field]
                    ? "15px 0px 0px 15px"
                    : "6px",
                }}
                value={
                  prefill[nodeId][field]
                    ? `${field}: ${prefill[nodeId][field]}`
                    : field
                }
                disabled={prefill[nodeId][field] || fieldName}
              />
              {prefill[nodeId][field] ? (
                <button
                  type="button"
                  id={field}
                  style={{
                    border: "1px solid rgb(222, 226, 230)",
                    borderLeftColor: "rgb(233, 236, 239)",
                    borderTopRightRadius: "15px",
                    borderBottomRightRadius: "15px",
                    zIndex: "1",
                    backgroundColor: "rgb(233, 236, 239)",
                    boxShadow: "0",
                  }}
                  onClick={handleFieldClear}
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

      <PrefillSidebar
        fieldName={fieldName}
        setFieldName={setFieldName}
        parentNodes={parentNodes}
      />
    </>
  );
}

export default Prefill;
