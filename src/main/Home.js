import React from "react";
import Nav from "./Nav";
import Snackbar from "./Snackbar";
import "./Main.css";
import { Outlet } from "react-router-dom";
export default function Home() {
  return (
    <Snackbar>
      <div className="home">
        <Nav></Nav>
        <Outlet />
      </div>
    </Snackbar>
  );
}
