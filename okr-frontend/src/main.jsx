import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { OkrProvider } from "./context/OkrContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <OkrProvider>
      <App />
    </OkrProvider>
  </React.StrictMode>
);
