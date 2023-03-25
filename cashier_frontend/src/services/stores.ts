import create from "zustand";
import { User } from "@/utils/response_interfaces";
import { setAuthToken } from "./axiosClient";

interface StoreType {
  currentUser: undefined | null | User;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
}

export const useStore = create<StoreType>((set) => ({
  currentUser: undefined,
  setCurrentUser: (user) => set({ currentUser: user }),
  logout: () => {
    localStorage.removeItem("user-token");
    setAuthToken(null);
    set({ currentUser: null });
  },
}));
