import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faList, faTrash } from "@fortawesome/free-solid-svg-icons";

library.add(faList, faTrash);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
