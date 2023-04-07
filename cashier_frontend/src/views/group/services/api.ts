import { GroupRequest } from "@/utils/requestInterfaces";
import { convertDateTimeRequestAPI } from "@/utils";
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
    return axios({
      method: "get",
      url: `users/${id}/groups/`,
      params: {
        page: params.page,
        page_size: params.rows,
        kw: filter,
        fromDate: convertDateTimeRequestAPI(params.fromDate),
        toDate: convertDateTimeRequestAPI(params.toDate),
      },
    });
  };

  apiCreateGroup = (data: GroupRequest) => {
    return axios.post(`cashier-groups/`, data);
  };

  apiGetGroupExpenseApproved = (id: any, params: any, filter: string) => {
    return axios({
      method: "get",
      url: `cashier-groups/${id}/expenses_approved/`,
      params: {
        page: params.page,
        page_size: params.rows,
        kw: filter,
        fromDate: convertDateTimeRequestAPI(params.fromDate),
        toDate: convertDateTimeRequestAPI(params.toDate),
      },
    });
  };

  apiGetGroupExpenseNotApproved = (id: any) => {
    return axios.get(`cashier-groups/${id}/expenses_not_approved/`);
  };

  apiGetGroupIncome = (id: any, params: any, filter: string) => {
    return axios({
      method: "get",
      url: `cashier-groups/${id}/income/`,
      params: {
        page: params.page,
        page_size: params.rows,
        kw: filter,
        fromDate: convertDateTimeRequestAPI(params.fromDate),
        toDate: convertDateTimeRequestAPI(params.toDate),
      },
    });
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

  apiGetTotal = (id: any, params: any) => {
    return axios({
      method: "get",
      url: `cashier-groups/${id}/get_totals/`,
      params: {
        fromDate: convertDateTimeRequestAPI(params.fromDate),
        toDate: convertDateTimeRequestAPI(params.toDate),
      },
    });
  };
}

export const API_GROUP = new ApiGroup();
