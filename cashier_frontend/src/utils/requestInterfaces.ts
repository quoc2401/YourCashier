export interface SignInUser {
  username: string;
  password: string;
}

export interface SignUpUser extends SignInUser {
  first_name: string;
  last_name: string;
  email: string;
  profile_picture: any | string;
}

export interface Expense {
  amount: number;
  description: string;
}

export interface Income {
  amount: number;
  description: string;
}

export interface GroupRequest {
  name: string;
  users: Array<number | undefined>;
  is_active: boolean;
}
