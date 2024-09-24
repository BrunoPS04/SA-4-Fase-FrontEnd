import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import TelaLogin from "../pages/TelaLogin";
import Relatorios from "../pages/Relatorios";
import Perfil from "../pages/Perfil";

const router = createBrowserRouter([

    {
        path: "/",
        element: <TelaLogin />,
    },

    {
        path: "/home",
        element: <Home />,
    },

    {
        path: "/relatorios",
        element: <Relatorios />,
    },

    {
        path: "/perfil",
        element: <Perfil />,
    },


]);

export default router;