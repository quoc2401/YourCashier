import axios from "axios";
// import {} from ''

export * as API_ACCOUNT from "@/views/account/services/api";
export * as API_GROUP from "@/views/group/services/api";
export * as API_USER from "@/views/individual/services/api";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}`,
});

axiosClient.interceptors.request.use(async (config) => {
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error.response.data);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosClient.defaults.headers.common["Authorization"];
  }
};

export default axiosClient;
