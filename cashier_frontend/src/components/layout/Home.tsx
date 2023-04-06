import { FC, useState, useEffect } from "react";
// import { Navigate } from "react-router-dom";
import { Outlet, NavLink, Navigate } from "react-router-dom";
import { useStore } from "@/services/stores";
import Header from "./Header";
import Footer from "./Footer";
import { Sidebar } from "primereact/sidebar";
import { isActiveStyle, notActiveStyle } from "@/utils/style";

const items = [
  {
    icon: "pi pi-home",
    name: "Home",
    path: "/",
  },
  {
    icon: "pi pi-users",
    name: "Group",
    path: "/groups",
  },
];

const Home: FC = () => {
  const currentUser = useStore((state) => state.currentUser);
  const [isOpenedSideBar, setIsOpenedSideBar] = useState(false);

  const items = [
    {
      icon: "pi pi-home",
      name: "Home",
      path: "/",
    },
    {
      icon: "pi pi-users",
      name: "Group",
      path: "/groups",
    },
  ];

  if (currentUser && currentUser?.is_staff == true)
    return <Navigate to={`/admin`} replace />;

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

export default Home;
