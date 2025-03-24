import React from "react";
import ReactDOM from "react-dom/client"; // Note the use of 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Create a root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render your app inside the root element
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
