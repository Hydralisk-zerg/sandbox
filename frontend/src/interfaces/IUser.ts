 export interface Department {
    id: number;
    name: string;
  }
  
  export interface Position {
    id: number;
    name: string;
  }
  
  export interface Employee {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    additional_email: string | null;
    phone: string | null;
    additional_phone: string | null;
    birth_date: string | null;
    department: Department;
    position: Position;
    hire_date: string | null;
    termination_date: string | null;
    avatar: string | null;
    registration_address: string | null;
    living_address: string | null;
  }

// types/auth.ts
export interface LoginResponse {
  detail: string;
}

export interface LogoutResponse {
  detail: string;
}
