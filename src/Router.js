import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Menu from "./screen/kanban/Menu";
import Table from "./screen/table/Table";
import Dashboard from "./screen/dashboard/Dashboard";
import Bill from "./screen/bill/Bill";
import Setting from "./screen/setting/Setting";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path: "/table",
        element: <Table />,
      },
      {
        path: "/bill",
        element: <Bill />,
      },
      {
        path: "/setting",
        element: <Setting />,
      },
    ],
  },
]);
export default function Router(props) {
  return <RouterProvider router={router}>{props.children}</RouterProvider>;
}
