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
  created_at?: string;
  updated_at?: string | null;
  last_login?: string;
  profile_picture?: string;
}

export interface Group {
  id?: number;
  supervisor: User;
  users: Array<User>;
  created_date: string;
  updated_date: string;
  is_active: boolean;
  name: string;
}
