import axiosClient from "@/services/axiosClient";
import { useStore } from "@/services/stores";

class ApiUser {
    
    apiGetExpenses: any = (id: number) => {
        return axiosClient.get(`users/${id}/expenses/`)
    }

    apiGetIncomes: any = (id: number) => {
        return axiosClient.get(`users/${id}/incomes/`)
    }
}

export const API_USER = new ApiUser();












