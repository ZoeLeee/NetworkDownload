import { createRoot } from "react-dom/client";
import { App } from "./app.tsx";

import "primereact/resources/primereact.css";

import "primeicons/primeicons.css";

import "./index.css";

createRoot(document.getElementById("app")!).render(<App />);
