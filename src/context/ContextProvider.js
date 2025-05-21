import { createContext, useState } from "react";

export const NodeContext = createContext({});
export const GraphContext = createContext({});

export function ContextProvider({ children, graph, setGraph }) {
  const [id, setId] = useState("");
  const [componentId, setComponentId] = useState("");
  const [name, setName] = useState("");

  return (
    <NodeContext.Provider
      value={{ id, setId, componentId, setComponentId, name, setName }}
    >
      <GraphContext.Provider value={{ graph, setGraph }}>
        {children}
      </GraphContext.Provider>
    </NodeContext.Provider>
  );
}
