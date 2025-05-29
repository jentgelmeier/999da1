import { BrowserRouter, Route, Routes } from "react-router";

import NodeList from "./components/NodeList";
import Prefill from "./components/Prefill";

import { ContextProvider } from "./context/ContextProvider";
import { Graph } from "./types";

function App({ testGraph }: { testGraph?: Graph }) {
  return (
    <ContextProvider testGraph={testGraph}>
      <BrowserRouter>
        <div>
          <Routes>
            <Route index element={<NodeList />} />
            <Route path="/prefill" element={<Prefill testGraph={testGraph} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
