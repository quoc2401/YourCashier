export interface User {
    id?: number;
    uuid: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_superuser?: boolean;
    is_staff?: boolean;
    is_active?: boolean;
    created_date?: string;
    updated_date?: string | null;
    last_login?: string;
    profile_picture?: string;
}
  

export interface Expense {
    amount: number;
    description: string;
    created_date: string;
}

export interface Income {
    amount: number;
    description: string;
    created_date: string;
}