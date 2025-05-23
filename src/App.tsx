import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import NodeList from "./components/NodeList";
import Prefill from "./components/Prefill";
import { ContextProvider } from "./context/ContextProvider";
import { Graph } from "./types";

function App() {
  const [graph, setGraph] = useState <Partial<Graph>>({});

  function fetchGraph() {
    const requestOptions = {
      method: "GET",
      "Content-Type": "application/json"
    };

    return fetch(
      "http://localhost:3001/api/v1/123/actions/blueprints/bp_456/bpv_123/graph/",
      requestOptions
    ).then((res) => res.json());
  }

  useEffect(() => {
    fetchGraph().then((data) => {
      setGraph(data);
    });
  }, []);

  return (
    <ContextProvider graph={graph} setGraph={setGraph}>
      <BrowserRouter>
        <div>
          <Routes>
            <Route index element={<NodeList graph={graph} />} />
            <Route path="/prefill" element={<Prefill />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
