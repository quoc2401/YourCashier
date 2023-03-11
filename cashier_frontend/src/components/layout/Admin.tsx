import { FC } from "react";
import { Outlet } from "react-router-dom";

const Admin: FC = () => {
  return (
    <div>
      Admin <Outlet></Outlet>
    </div>
  );
};

export default Admin;
