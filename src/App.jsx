import "./App.css";
import { useEffect, useState } from "react";

import NodeList from "./components/NodeList";

function App() {
  const [graph, setGraph] = useState({});

  function fetchGraph() {
    return fetch(
      "http://localhost:3001/api/v1/123/actions/blueprints/bp_456/bpv_123/graph/",
      {
        method: "GET",
        "Content-Type": "application/json",
      }
    ).then((res) => res.json());
  }

  useEffect(() => {
    fetchGraph().then((data) => {
      setGraph(data);
      console.log(data);
    });
  }, []);

  return (<NodeList graph={graph} />);
}

export default App;
