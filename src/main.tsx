import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import "primereact/resources/primereact.min.css"
import "primereact/resources/themes/lara-light-indigo/theme.css" // theme
import "primereact/resources/primereact.css" // icons
import "primeflex/primeflex.css" // core css
import "primeicons/primeicons.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
