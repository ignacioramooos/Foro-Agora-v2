import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const redirectedPath = sessionStorage.getItem("spa:redirect");
if (redirectedPath) {
  sessionStorage.removeItem("spa:redirect");
  window.history.replaceState(null, "", redirectedPath);
}

createRoot(document.getElementById("root")!).render(<App />);
