import "./App.css";
import { useEffect, useState } from "react";

import NodeList from "./components/NodeList";
import Prefill from "./components/Prefill";
import { BrowserRouter, Route, Router, Routes } from "react-router";

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

  return (
     <BrowserRouter>
      <div>
        <Routes>
          <Route index element={<NodeList graph={graph} />} />
          <Route path="/prefill" element={<Prefill />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
