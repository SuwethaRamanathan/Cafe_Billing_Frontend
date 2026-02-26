import React from "react";
import ReactDOM from "react-dom/client";
import { SettingsProvider } from "./SettingsContext";
import App from './App.jsx'

ReactDOM. createRoot(document.getElementById('root')).render(
   <SettingsProvider>
    <App />
  </SettingsProvider>
)
