import React from "react";
import "./Layout.css";

export default function Main(props) {
  return <div className="bodyMain">{props.children}</div>;
}
