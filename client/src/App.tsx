import React from "react";
import RouterComponent from "./components/Router/RouterComponent";
import "./css/main.css";
import useSocketListeners from "./Hooks/useSocketListeners";

function App() {
  useSocketListeners();

  return (
    <div className="container">
      <RouterComponent />
    </div>
  );
}

export default App;
