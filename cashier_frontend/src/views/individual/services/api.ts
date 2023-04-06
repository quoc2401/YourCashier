import axiosClient from "@/services/axiosClient";
import { Expense as RExpense, Income as RIncome } from "@/utils/requestInterfaces";
import { Expense, Income } from "@/utils/responseInterfaces";

class ApiUser {
    
    apiGetExpenses: any = (userId: number, params: any) => {
        return axiosClient({
            method: "get",
            url: `users/${userId}/expenses/`,
            params: {
                ...params
            },
        })
    }

    apiGetIncomes: any = (userId: number, params: any) => {
        return axiosClient({
            method: "get",
            url: `users/${userId}/incomes/`,
            params: {
                ...params
            },
        })
    }

    apiCreateIncome: any = (data: RIncome) => {
        return axiosClient.post(`incomes/`, data)
    }

    apiCreateExpense: any = (data: RExpense) => {
        return axiosClient.post(`expenses/`, data)
    }

    apiUpdateIncome: any = (data: Income) => {
        return axiosClient.patch(`incomes/${data.id}/`, data)
    }

    apiDeleteIncome: any = (id: number) => {
        return axiosClient.delete(`incomes/${id}/`)
    }

    apiUpdateExpense: any = (data: Expense) => {
        return axiosClient.patch(`expenses/${data.id}/`, data)
    }

    apiDeleteExpense: any = (id: number) => {
        return axiosClient.delete(`expenses/${id}/`)
    }

    apiGetTotal: any = (params: any) => {
        return axiosClient({
            method: "get",
            url: `users/total_stats/`,
            params: {
                ...params
            },
        })
    }
}

export const API_USER = new ApiUser();












