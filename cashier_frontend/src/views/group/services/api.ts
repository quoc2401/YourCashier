import { GroupRequest } from "./../../../utils/requestInterfaces";
import axios from "@/services/axiosClient";

class ApiGroup {
  apiGetAllUsers = (params: any, filter: string) => {
    return axios.get(
      `users/?page=${params.page}&page_size=${params.rows}&kw=${filter}`
    );
  };

  apiGetGroupByUser = (id: number | undefined, params: any, filter: string) => {
    return axios.get(
      `users/${id}/groups/?page=${params.page}&page_size=${params.rows}&kw=${filter}`
    );
  };

  apiCreateGroup = (data: GroupRequest) => {
    return axios.post(`cashier-groups/`, data);
  };
}

export const API_GROUP = new ApiGroup();
