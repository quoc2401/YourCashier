import { FC } from "react";
import { useRoutes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "./layout/Home";
import Admin from "./layout/Admin";
import SignIn from "@/views/account/SignIn";
import SignUp from "@/views/account/SignUp";
import UserView from "@/views/individual/UserView";
import GroupView from "@/views/group/GroupView";
import GroupDetail from "@/views/group/GroupDetail";
import AccountInfo from "@/views/account/AccountInfo";
import UserAccountList from "@/views/admin/UserAccountList";
import Dashboard from "@/views/admin/Dashboard";

const Router: FC = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
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
          path: "/groups",
          element: <GroupView />,
        },
        {
          path: "/group/:groupId",
          element: <GroupDetail />,
        },
      ],
    },
    {
      path: "/admin",
      element: <Admin />,
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
