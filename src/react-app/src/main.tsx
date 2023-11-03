import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { ErrorBoundary } from "./components/error-boundary";
import "prismjs";
import "./styles/index.scss";
import "./styles/prism.scss";
import "react-popper-tooltip/dist/styles.css";
import "reactflow/dist/style.css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-markdown";

registerServiceWorker();
let basename = import.meta.env.BASE_URL;
if (!basename.endsWith("/")) {
  basename = basename + "/";
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const url = `${basename}service-worker.js`;

      navigator.serviceWorker
        .register(url)
        .then((registration) => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;

            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    console.log("New version is available");
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }
}
