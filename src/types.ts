export type SetString = (arg0: string) => void;

export interface NodeContextType {
  nodeId: string;
  setNodeId: SetString;
  componentId: string;
  setComponentId: SetString;
  name: string;
  setName: SetString;
}

interface Edge {
  source: string;
  target: string;
}

export interface Node {
  [key: string]: any;
}

export interface Graph {
  $schema: string;
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  category: string;
  nodes: Node[];
  edges: Edge[];
  forms: Node[];
  branches: [];
  triggers: [];
}

export type setGraph = (graph: Graph) => void;

export type GraphContextType = {
  graph?: Partial<Graph>;
  setGraph: setGraph;
};

export interface PrefillType {
  "form-0f58384c-4966-4ce6-9ec2-40b96d61f745": {
    [key: string]: string;
  };
  "form-e15d42df-c7c0-4819-9391-53730e6d47b3": {
    [key: string]: string;
  };
  "form-bad163fd-09bd-4710-ad80-245f31b797d5": {
    [key: string]: string;
  };
  "form-a4750667-d774-40fb-9b0a-44f8539ff6c4": {
    [key: string]: string;
  };
  "form-47c61d17-62b0-4c42-8ca2-0eff641c9d88": {
    [key: string]: string;
  };
  "form-7c26f280-7bff-40e3-b9a5-0533136f52c3": {
    [key: string]: string;
  };
}

export type PrefillContextType = {
  prefill?: PrefillType;
  setPrefill: Function;
};

export interface DataSource {
  title: string;
  id: string;
  elements: string[];
}
