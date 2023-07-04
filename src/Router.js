import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Menu from "./screen/Menu";
import Table from "./screen/Table";
import Dashboard from "./screen/Dashboard";
import Bill from "./screen/Bill";
import Setting from "./screen/Setting";
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
