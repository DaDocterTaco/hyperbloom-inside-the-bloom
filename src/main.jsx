import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import "./bloom.css";
import "./journey.css";
import "./parity.css";
import "./cinema.css";
import "./refinements.css";
import "./premium.css";
import "./legal.css";
import "./finale.css";
import "./lower-bloom.css";
import "./home-chapter-bloom.css";
import "./bloom-finale.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
