import React from "react";
import AcceptCall from "./components/HomePage/Chat/AcceptCall";
import RouterComponent from "./components/Router/RouterComponent";
import useSocketListeners from "./Hooks/useSocketListeners";
import CallAudio from "./components/HomePage/Chat/CallAudio";

import "./css/main.css";

function App() {
  useSocketListeners();

  return (
    <div className="container">
      <CallAudio />
      <AcceptCall />
      <RouterComponent />
    </div>
  );
}

export default App;
