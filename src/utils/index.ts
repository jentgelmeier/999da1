import { Graph, Node } from "../types";

export function nodeSort(a: Node, b: Node): number {
  if (a.data?.name < b.data?.name) {
    return -1;
  }
  if (a.data?.name > b.data?.name) {
    return 1;
  }
  return 0;
}

export function fetchGraph(): Promise<Graph> {
  const requestOptions = {
    method: "GET",
    "Content-Type": "application/json",
  };

  return fetch(
    "http://localhost:3001/api/v1/123/actions/blueprints/bp_456/bpv_123/graph/",
    requestOptions
  )
    .then((res: Response) => res.json())
    .catch((err: string) => console.error(err));
}
