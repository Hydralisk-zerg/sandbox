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
    firstName: string;
    lastName: string;
    additionalEmail: string | null;
    phone: string | null;
    additionalPhone: string | null;
    birthDate: string | null;
    department: Department;
    position: Position;
    hireDate: string | null;
    terminationDate: string | null;
    avatar: string;
    registrationAddress: string | null;
    livingAddress: string | null;
  }

// types/auth.ts
export interface LoginResponse {
  detail: string;
}

export interface LogoutResponse {
  detail: string;
}

export interface CountryData {
  id: number;
  name_en: string;
  name_uk: string;
  alpha2: string;
  alpha3: string;
  numeric?: string; 
}

export interface GenericDataType {
  id: number;
  [key: string]: any;
}

export interface ApiResponse {
  [key: string]: GenericDataType[];
}

export interface Template {
  id?: number;
  name: string;
  created_by: number; // ID пользователя
  created_at: string; // ISO строка даты
  task_groups: {
    department_id: number | null;
    employee_id: number | null;
    tasks: string[];
  }[];
}

export interface TemplateState {
  templates: Template[];
  setTemplates: (templates: Template[]) => void;
}