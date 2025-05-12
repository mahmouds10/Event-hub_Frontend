import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import MyProfile from "../pages/MyProfile.jsx";
import Home from "../pages/Home.jsx";
import NotFound from "../pages/NotFound.jsx";
import AdminPanal from "../pages/AdminPanal.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AllUsers from "../pages/AllUsers.jsx";
import AllEvents from "../pages/AllEvents.jsx";
import EventPage from "../pages/EventPage.jsx";
import Cart from "../pages/Cart.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />,
                index: true,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
            {
                path: "/my-profile",
                element: (
                    <ProtectedRoute allowedRoles={["user", "admin"]}>
                        <MyProfile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/cart",
                element: (
                    <ProtectedRoute allowedRoles={["user", "admin"]}>
                        <Cart />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/event/:id",
                element: <EventPage />,
            },
            {
                path: "/admin-panal",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminPanal />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: "all-users",
                        element: <AllUsers />,
                    },
                    {
                        index: true,
                        element: <AllUsers />,
                    },
                    {
                        path: "all-events",
                        element: <AllEvents />,
                    },
                    {
                        path: "*",
                        element: <NotFound />,
                    },
                ],
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);
