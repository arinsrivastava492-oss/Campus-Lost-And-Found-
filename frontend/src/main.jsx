// main.jsx
// -----------------------------------------------------------------------
// The very first file that runs in the browser. It "mounts" our React
// App component into the <div id="root"> from index.html, and wraps it
// with the tools every page needs: routing and authentication.
// -----------------------------------------------------------------------

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
