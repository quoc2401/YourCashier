import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Sidebar } from "primereact/sidebar";
import { useStore } from "@/services/stores";
import { NavLink } from "react-router-dom";
import { isActiveStyle, notActiveStyle } from "@/utils/style";
import Footer from "./Footer";

const items = [
  {
    icon: "pi pi-home",
    name: "Dashboard",
    path: "/admin",
  },
  {
    icon: "pi pi-users",
    name: "Users",
    path: "/admin/users-administration",
  },
];

const Admin: FC = () => {
  const currentUser = useStore((state) => state.currentUser);
  const [isOpenedSideBar, setIsOpenedSideBar] = useState(false);

  return (
    <div>
      <Header
        setOpenedSideBar={setIsOpenedSideBar}
        openedSideBar={isOpenedSideBar}
      />

      <Sidebar
        visible={isOpenedSideBar}
        onHide={() => setIsOpenedSideBar(false)}
      >
        <ul className="list-none p-0 m-0">
          {items.map((item) => (
            <li key={item.name} className="mt-1">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? isActiveStyle : notActiveStyle
                }
                onClick={() => setIsOpenedSideBar(false)}
                end
              >
                <i className={`text-md ${item.icon}`}></i>
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </Sidebar>

      <div className="flex flex-col min-h-screen justify-between transition-all transition-duration-200 pt-[5rem]">
        <div style={{ flex: "1 1 auto" }}>
          <Outlet></Outlet>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Admin;
