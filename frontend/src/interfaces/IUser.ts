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

// export interface CurrentUser {
//   id: number;
//   username: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   additionalEmail: string | null;
//   phone: string | null;
//   additionalPhone: string | null;
//   birthDate: string | null;
//   department: string;
//   position: string;
//   hireDate: string | null;
//   terminationDate: string | null;
//   avatar: string;
//   registrationAddress: string | null;
//   livingAddress: string | null;
//   groups: string[];
//   permissions: string[];
// }
