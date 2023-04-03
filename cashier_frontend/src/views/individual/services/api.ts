import axiosClient from "@/services/axiosClient";
import { Expense as RExpense, Income as RIncome } from "@/utils/requestInterfaces";
import { Expense, Income } from "@/utils/responseInterfaces";

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
        const queryParams = params
        ? Object.keys(params)
            .map(
              k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
            )
            .join('&')
        : ''
        return axiosClient.get(`users/total_stats/?${queryParams}`)
    }
}

export const API_USER = new ApiUser();












