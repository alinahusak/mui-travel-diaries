import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AppRouter from "./components/AppRouter";
import { Provider } from "react-redux";
import { store } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </AppRouter>
  </React.StrictMode>
);
