export interface user_data {
  f_name?: string;
  role?: string;
  email?: string;
  password?: string;
}

export interface task_info {
  title?: string;
  due_date?: string;
  priority?: string;
  status?: string;
  assign?: string;
  desc?: string;
  email?: string;
}

export interface AuthResult {
  user?: { email: string; role?: string };
  error?: string;
  status: number;
}

export interface AuthorizationResult {
  authorized?: boolean;
  error?: string;
  status: number;
}

