import { SignInUser, SignUpUser } from "@/utils/request_interfaces";
import { User } from "@/utils/response_interfaces";
import axios from "@/services/axiosClient"
  
class ApiAuth {
    constructor() {
    }
    apiLogin: any = (user: SignInUser) => {
        console.log(user)
        return axios.post("users/login/", user)   
    };

    apiLogout: any = () => {
        
    }

    apiSignUp: any = (data: SignUpUser) => {
        const headers = {
            "Content-Type": "multipart/form-data"
        }
        return axios.post("users/signup/", data, {
            headers: headers
        })
    }
}

class ApiAccount {}



export const API_AUTH = new ApiAuth();
export const API_ACCOUNT = new ApiAccount();
