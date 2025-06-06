/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import PrefillSidebar from "./PrefillSidebar";

import {
  GraphContext,
  NodeContext,
  PrefillContext,
} from "../context/ContextProvider";

import { Graph } from "../types";

function Prefill({ testGraph }: { testGraph?: Graph }) {
  const navigate = useNavigate();

  const [fieldName, setFieldName] = useState("");
  const [fields, setFields] = useState<string[]>([]);

  const { nodeId, componentId, name } = useContext(NodeContext);
  const { graph } = useContext(GraphContext);
  const { prefill, setPrefill } = useContext(PrefillContext);

  useEffect(() => {
    if (!nodeId && testGraph) {
      navigate("/");
      return;
    }
    // retrieve fields to display
    const form = graph?.forms?.filter((f) => f.id === componentId)[0];
    setFields(Object.keys(form?.field_schema?.properties || {}));
  }, [graph]);

  function handleClick(event: React.MouseEvent<HTMLInputElement>) {
    const { target } = event;

    (target as HTMLInputElement).select();
    setFieldName(`${name}.${(target as HTMLInputElement).value}`);
  }

  function handleFieldClear(event: React.MouseEvent<HTMLButtonElement>) {
    let { target }: { target: EventTarget | null } = event;
    let { id } = target as HTMLElement;

    // only button has an id, so loop through parent elements until the button id is selected
    while (!id) {
      target = (target as HTMLElement).parentElement;
      id = (target as HTMLElement).id;
    }

    const prefillCopy = { ...prefill };
    // @ts-ignore
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
              {/* @ts-ignore */}
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
                  // @ts-ignore
                  prefill[nodeId][field]
                    ? "form-control"
                    : "form-control text-muted"
                }
                onClick={handleClick}
                onChange={() => {}} //added onChange to remove React console error
                style={{
                  // @ts-ignore
                  marginLeft: prefill[nodeId][field] ? "14px" : "",
                  // @ts-ignore
                  paddingLeft: prefill[nodeId][field] ? ".75rem" : "30px",
                  backgroundColor: "rgb(233, 236, 239)",
                  // @ts-ignore
                  borderRadius: prefill[nodeId][field]
                    ? "15px 0px 0px 15px"
                    : "6px",
                }}
                value={
                  // @ts-ignore
                  prefill[nodeId][field]
                    ? // @ts-ignore
                      `${field}: ${prefill[nodeId][field]}`
                    : field
                }
                // @ts-ignore
                disabled={prefill[nodeId][field] || fieldName}
              />
              {/* @ts-ignore */}
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
                    data-testid={"x-" + field}
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
        nodeId={nodeId}
      />
    </>
  );
}

export default Prefill;
