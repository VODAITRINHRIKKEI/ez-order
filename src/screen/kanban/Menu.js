import React from "react";
import Layout from "../../layout/Layout";
import Kanban from "./Kanban";
import Tab from "./Tab";

export default function Menu() {
  return <Layout main={<Kanban />} tab={<Tab />} />;
}
