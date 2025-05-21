import "./App.css";
import { useEffect, useState } from "react";

import NodeList from "./components/NodeList";
import Prefill from "./components/Prefill";
import { BrowserRouter, Route, Routes } from "react-router";
import { ContextProvider } from "./context/ContextProvider";

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
