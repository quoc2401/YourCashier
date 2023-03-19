export interface SignInUser {
    username: string;
    password: string;
}
  
export interface SignUpUser extends SignInUser {
    first_name: string;
    last_name: string;
    email: string;
    profile_picture: Object | string;
}