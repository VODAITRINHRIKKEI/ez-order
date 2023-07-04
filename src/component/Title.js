import React from "react";
import "./Component.css";
export default function Title(props) {
  return <p className="titleComponent">{props.children}</p>;
}
