import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);
const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: "#6F6AF2",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#A8A7CD",
    },
    redColor: {
      main: "#DD2838",
    },
    whiteColor: {
      // This is green.A700 as hex.
      main: "#fff",
    },
    darkColor: {
      // This is green.A700 as hex.
      main: "#383576",
    },
    backgroundColor: {
      main: "#F8FAFB",
    },
  },
});
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
