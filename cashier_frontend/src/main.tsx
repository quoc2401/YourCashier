import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "primereact/resources/themes/saga-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "tippy.js/dist/tippy.css";
import "react-toastify/dist/ReactToastify.min.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <App />

    <ToastContainer
      position="top-right"
      autoClose={3000}
      pauseOnHover={false}
    />
  </BrowserRouter>
);
