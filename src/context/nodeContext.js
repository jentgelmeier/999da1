import { createContext, useState } from "react";

export const NodeContext = createContext({});

export function NodeProvider({ children }) {
  const [id, setId] = useState({});
  const [componentId, setComponentId] = useState("");
  const [name, setName] = useState("");

  return (
    <NodeContext.Provider
      value={{ id, setId, componentId, setComponentId, name, setName}}
    >
      {children}
    </NodeContext.Provider>
  );
}
