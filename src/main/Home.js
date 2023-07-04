import React from "react";
import Nav from "./Nav";
import "./Main.css";
import { Outlet } from "react-router-dom";
export default function Home() {
  return (
    <div className="home">
      <Nav></Nav>
      <div className="homeContent">
        <Outlet />
      </div>
    </div>
  );
}
