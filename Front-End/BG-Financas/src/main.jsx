import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ReactDOM } from "react";
import router from "./router/routes";
import "./index.css";

createRoot(document.getElementById("root")).render(

  <RouterProvider router={router}>

  </RouterProvider>

);