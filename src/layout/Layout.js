import React from "react";
import Main from "./Main";
import Tab from "./Tab";
import "./Layout.css";
export default function Layout({ main, tab }) {
  return (
    <div className="bodyLayout">
      <Main>{main}</Main>
      <Tab>{tab}</Tab>
    </div>
  );
}
