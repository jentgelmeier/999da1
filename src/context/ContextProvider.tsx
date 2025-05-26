import { createContext, useState } from "react";
import {
  Graph,
  GraphContextType,
  NodeContextType,
  PrefillContextType,
  PrefillType,
} from "../types";

export const NodeContext = createContext<NodeContextType>({
  nodeId: "",
  setNodeId: () => {},
  componentId: "",
  setComponentId: () => {},
  name: "",
  setName: () => {},
});
export const GraphContext = createContext<GraphContextType>({
  setGraph: () => {},
});
export const PrefillContext = createContext<PrefillContextType>({
  setPrefill: () => {},
});

export function ContextProvider({ children, testGraph }: { children: any, testGraph?: Graph }) {
  const [graph, setGraph] = useState<Partial<Graph>>(testGraph || {});
  const [nodeId, setNodeId] = useState<string>("");
  const [componentId, setComponentId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [prefill, setPrefill] = useState<PrefillType>({
    "form-0f58384c-4966-4ce6-9ec2-40b96d61f745": {},
    "form-e15d42df-c7c0-4819-9391-53730e6d47b3": {},
    "form-bad163fd-09bd-4710-ad80-245f31b797d5": {},
    "form-a4750667-d774-40fb-9b0a-44f8539ff6c4": {},
    "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88": {
      button: "Action Properties.button",
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
