import axios from "@/services/axiosClient"

class ApiAdmin {
    apiGetUsers: any = (params: any) => {
        const queryParams = params
        ? Object.keys(params)
            .map(k => k + '=' + params[k])
            .join('&')
        : ''
        return axios.get(`users/?${queryParams}`)
    }

    apiActiveUser: any = (uuid: string) => {
        return axios.patch(`users/active/`, {uuid: uuid})
    }
}

export const API_ADMIN = new ApiAdmin();