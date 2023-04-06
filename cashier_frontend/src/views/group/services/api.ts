import { GroupRequest } from "@/utils/requestInterfaces";
import axios from "@/services/axiosClient";

class ApiGroup {
  apiGetGroupDetail = (id: any) => {
    return axios.get(`cashier-groups/${id}/`);
  };

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

  apiGetGroupExpenseApproved = (id: any, params: any, filter: string) => {
    return axios.get(
      `cashier-groups/${id}/expenses_approved/?page=${params.page}&page_size=${params.rows}&kw=${filter}`
    );
  };

  apiGetGroupExpenseNotApproved = (id: any) => {
    return axios.get(`cashier-groups/${id}/expenses_not_approved/`);
  };

  apiGetGroupIncome = (id: any, params: any, filter: string) => {
    return axios.get(
      `cashier-groups/${id}/income/?page=${params.page}&page_size=${params.rows}&kw=${filter}`
    );
  };

  apiGetGroupMember = (id: any) => {
    return axios.get(`cashier-groups/${id}/users/`);
  };

  apiGetApprovedExpense = (id: any, params: any) => {
    return axios.patch(`group-expenses/${id}/approve/`, params);
  };

  apiGetRejectExpense = (id: any, params: any) => {
    return axios.patch(`group-expenses/${id}/reject/`, params);
  };

  apiCreateExpense = (params: any) => {
    return axios.post(`group-expenses/`, params);
  };

  apiCreateIncome = (params: any) => {
    return axios.post(`group-incomes/`, params);
  };
}

export const API_GROUP = new ApiGroup();
