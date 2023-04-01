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
