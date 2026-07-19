import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { LocaleProvider } from "@/providers/LocaleProvider";
import App from "@/App";
import { loadInitialData } from "@/lib/initialLoad";
import "@/index.css";

loadInitialData();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <LocaleProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LocaleProvider>
    </Provider>
  </StrictMode>,
);
