import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [graph, setGraph] = useState();

  function fetchGraph() {
    return fetch('http://localhost:3001/api/v1/123/actions/blueprints/bp_456/bpv_123/graph/', {
      method: 'GET',
      'Content-Type': 'application/json'
    }).then(res => res.json());
  }

  useEffect( () => {
    fetchGraph().then(data => {
      setGraph(data);
      console.log(data);
    });
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>{JSON.stringify(graph)}</div>
    </div>
  );
}

export default App;
