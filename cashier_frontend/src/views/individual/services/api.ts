import axiosClient from "@/services/axiosClient";
import { useStore } from "@/services/stores";

class ApiUser {
    
    apiGetExpenses: any = (userId: number, params: any) => {
        const queryParams = params
        ? Object.keys(params)
            .map(
              k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
            )
            .join('&')
        : ''
        return axiosClient.get(`users/${userId}/expenses/?${queryParams}`)
    }

    apiGetIncomes: any = (userId: number, params: any) => {
        const queryParams = params
        ? Object.keys(params)
            .map(
              k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
            )
            .join('&')
        : ''
        return axiosClient.get(`users/${userId}/incomes/?${queryParams}`)
    }
}

export const API_USER = new ApiUser();












