import { createContext, useState } from "react";

export const NodeContext = createContext();
export const GraphContext = createContext();
export const PrefillContext = createContext();

export function ContextProvider({ children, graph, setGraph }) {
  const [nodeId, setNodeId] = useState("");
  const [componentId, setComponentId] = useState("");
  const [name, setName] = useState("");
  const [prefill, setPrefill] = useState({
    "form-0f58384c-4966-4ce6-9ec2-40b96d61f745": {},
    "form-e15d42df-c7c0-4819-9391-53730e6d47b3": {},
    "form-bad163fd-09bd-4710-ad80-245f31b797d5": {},
    "form-a4750667-d774-40fb-9b0a-44f8539ff6c4": {},
    "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88": {
      button: "Form A.button",
    },
    "form-7c26f280-7bff-40e3-b9a5-0533136f52c3": {},
  });

  return (
    <NodeContext.Provider
      value={{ nodeId, setNodeId, componentId, setComponentId, name, setName }}
    >
      <GraphContext.Provider value={{ graph, setGraph }}>
        <PrefillContext.Provider value={{ prefill, setPrefill }}>
          {children}
        </PrefillContext.Provider>
      </GraphContext.Provider>
    </NodeContext.Provider>
  );
}
