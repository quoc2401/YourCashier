export interface User {
  id?: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  phone: string | null;
  user_role: string;
  created_at: string;
  updated_at: string | null;
}
