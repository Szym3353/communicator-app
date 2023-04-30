import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { CallProvider } from "./Context/callContext";
import store from "./store";

import * as process from "process";

window.global = window;
window.process = process;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CallProvider>
        <App />
      </CallProvider>
    </Provider>
  </React.StrictMode>
);
