import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import reportWebVitals from "./reportWebVitals";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Router from "./Router";
import "./index.css";
const container = document.getElementById("root");
const root = createRoot(container);
const theme = createTheme({
  palette: {
    primary: {
      main: "#6F6AF2",
    },
    secondary: {
      main: "#A8A7CD",
    },
    redColor: {
      main: "#DD2838",
    },
    whiteColor: {
      main: "#fff",
    },
    darkColor: {
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
        <Router></Router>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
