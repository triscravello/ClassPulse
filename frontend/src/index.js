import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import App from "./App";
import { Toaster } from "react-hot-toast";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        {/* Global Toaster */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{ style: { fontSize: "0.95rem" }, duration: 4000 }}
        />
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);