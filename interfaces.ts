export interface admin_data {
  f_name?: string;
  role?: string;
  email?: string;
  password?: string;    
}

export interface user_data {
  f_name?: string;
  role?: string;
  email?: string;
  password?: string;  
  is_active?:boolean;
  admin_email?:string;
}

export interface admin_option {
  admin_email: string;
  admin_name?: string | null;
}

export interface task_info {
  title?: string;
  due_date?: string;
  priority?: string;
  status?: string;
  assign?: string;
  desc?: string;
  admin_email?: string;
}
export interface UserPermissionProps {
  email?: string;
  admin_email?: string;
  title?: string;
  assign?: string;
}

