import { FC } from "react";
import { useRoutes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "./layout/Home";
import Admin from "./layout/Admin";
import SignIn from "@/views/account/SignIn";
import SignUp from "@/views/account/SignUp";
import UserView from "@/views/individual/UserView";
import GroupView from "@/views/group/GroupView";
import AccountInfo from "@/views/account/AccountInfo";
import UserAccountList from "@/views/admin/UserAccountList";
import Dashboard from "@/views/admin/Dashboard";

const Router: FC = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: (
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: <UserView />,
        },
        {
          path: "/account",
          element: <AccountInfo />,
        },
        {
          path: "group/:groupId",
          element: <GroupView />,
        },
      ],
    },
    {
      path: "/admin",
      element: (
        <PrivateRoute>
          <Admin />
        </PrivateRoute>
      ),
      children: [
        {
          element: <Dashboard />,
        },
        {
          path: "user-account",
          element: <UserAccountList />,
        },
      ],
    },
    {
      path: "/login",
      element: <SignIn />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
  ]);

  return routes;
};

export default Router;
