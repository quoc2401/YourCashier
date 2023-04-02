import { FC, useEffect } from "react";
import Router from "./components/Router";
import { API_ACCOUNT } from "@/services/axiosClient";
import { setAuthToken } from "@/services/axiosClient";
import { useStore } from "@/services/stores";
import { CircularProgress } from "react-cssfx-loading";

const App: FC = () => {
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const currentUser = useStore((state) => state.currentUser);
  const refresh_token = localStorage.getItem("refresh-token");
  const logout = useStore((state) => state.logout);

  useEffect(() => {
    const token = localStorage.getItem("user-token") || "";
    if (!token) {
      logout();
    } else {
      setAuthToken(token as string);
      getUserProfile();
    }
  }, []);

  const getUserProfile = async () => {
    if (refresh_token) {
      try {
        const res = await API_ACCOUNT.API_AUTH.apiRefresh(refresh_token);
        if (res.status === 200) {
          localStorage.setItem("user-token", res.data.access_token);
          localStorage.setItem("refresh-token", res.data.refresh_token);
          setAuthToken(res.data.access_token);
          setCurrentUser(res.data.user);
        }
      } catch (error) {
        logout();
      }
    }
  };

  if (typeof currentUser === "undefined")
    return (
      <div className="fixed bg-slate-200 top-0 bottom-0 right-0 left-0 flex flex-col items-center justify-center z-[9999]">
        <CircularProgress color="#744ea6" />
      </div>
    );

  return <Router />;
};

export default App;
