import { FC, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { CircularProgress } from "react-cssfx-loading";
import Tippy from "@tippyjs/react";
import { Menu, MenuProps } from "primereact/menu";
import { toast } from "react-toastify";
import { useStore } from "@/services/stores";
import { API_ACCOUNT } from "@/services/axiosClient";
import { MenuItem } from "primereact/menuitem";
import WarnMenuItem from "../WarnMenuItem";
import { PrimeIcons } from "primereact/api";

interface HeaderProps {
  setOpenedSideBar: (e: boolean) => void;
  openedSideBar: boolean;
}

const Header: FC<HeaderProps> = ({ setOpenedSideBar, openedSideBar }) => {
  const [loading, setLoading] = useState(false);
  const menu = useRef<Menu>(null);
  const setLogoutState = useStore(state => state.logout)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await API_ACCOUNT.API_AUTH.apiLogout()
      setLogoutState()
    } catch (error) {
      toast.error('An error occurred while logging out', { theme: 'colored' })
    }
    setLoading(false)
  }
  const menuItems:MenuItem[] = [
    {
      label: "Your account info",
      icon: PrimeIcons.USER,
      command: () => {
        // window.location.pathname = '/user-info'
      },
    },
    {
      label: "Sign out",
      icon: PrimeIcons.SIGN_OUT,
      command: () => {
        handleLogout();
      },
    },
    {
      label: "Warning option",
      icon: PrimeIcons.BELL,
      template: WarnMenuItem
    }
  ];

  return (
    <>
      <div className="fixed justify-between lg:justify-start top-0 left-0 w-full h-[3.5rem] bg-primary-300 shadow-md flex items-center px-6 text-slate-600 z-[1001] text-white">
        <Link
          className="flex items-center font-medium text-xl order-2 lg:order-1 lg:w-[15rem]"
          to="/"
        >
          <span>YOUR CASHIER</span>
        </Link>

        <button
          className="p-link header-button order-1 lg:order-2 lg:ml-3"
          onClick={() => setOpenedSideBar(!openedSideBar)}
        >
          <i className="pi pi-bars text-xl text-white"></i>
        </button>

        <div className="flex order-3 lg:ml-auto space-x-3">
          <Tippy content="Menu" arrow={false}>
            <button
              aria-controls="menu"
              aria-haspopup
              className="p-link header-button"
              onClick={(e) => menu.current?.toggle(e)}
            >
              <i className="pi pi-user text-xl text-white"></i>
            </button>
          </Tippy>

          <Menu ref={menu} model={menuItems} popup id="menu" />
        </div>
      </div>
      {loading && (
        <div className="fixed bg-overlay top-0 bottom-0 right-0 left-0 flex flex-col items-center justify-center z-[9999]">
          <CircularProgress color="#22c55e" />
        </div>
      )}
    </>
  );
};

export default Header;
