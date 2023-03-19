import { SignInUser } from "@/utils/request_interfaces";
import { User } from "@/utils/response_interfaces";
import axios from "@/services/axiosClient"
  
class ApiAuth {
    constructor() {
    }
    apiLogin: any = (user: SignInUser) => {
        console.log(user)
        return axios.post("users/login/", user)   
    };
}

class ApiAccount {}



export const API_AUTH = new ApiAuth();
export const API_ACCOUNT = new ApiAccount();
