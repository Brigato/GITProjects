import React, { useEffect, useState } from "react";
import api from "./services/api";
import DevItem from "./components/DevItem";
import DevForm from "./components/DevForm";

import "./App.css";
import "./global.css";
import "./sidebar.css";
import "./main.css";

// Component: Isolated HTML, JS and CSS block, which does not interfere in the rest of the application
// State: Information kept by the component (remember: imutability!!!)
// Prop: Information passed from the father component to the child component

function App() {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get("/devs");

      setDevs(response.data);
    }

    loadDevs();
  }, []);

  async function handleAddDev(data) {
    const response = await api.post("/devs", data);

    setDevs([...devs, response.data]);
  }

  return (
    <div id="app">
      <aside>
        <strong>Add Dev</strong>
        <DevForm onSubmit={handleAddDev}></DevForm>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
