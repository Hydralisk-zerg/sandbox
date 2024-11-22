import { Employee, LoginResponse, LogoutResponse } from "../interfaces/IUser";

interface ApiClientConfig {
    baseURL: string;
  }
  
  class ApiClient {
    private baseURL: string;
  
    constructor(config: ApiClientConfig) {
      this.baseURL = config.baseURL;
    }
  
    private getCsrfToken(): string {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; csrftoken=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
      return '';
    }
  
    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-CSRFToken': this.getCsrfToken(),
        ...options.headers,
      };
  
      const config: RequestInit = {
        ...options,
        credentials: 'include',
        headers,
      };
  
      if (options.body) {
        config.body = JSON.stringify(options.body);
      }
  
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, config);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data as T;
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  
    get<T>(endpoint: string) {
      return this.request<T>(endpoint, { method: 'GET' });
    }
  
    post<T>(endpoint: string, data: any) {
      return this.request<T>(endpoint, {
        method: 'POST',
        body: data,
      });
    }
  
    put<T>(endpoint: string, data: any) {
      return this.request<T>(endpoint, {
        method: 'PUT',
        body: data,
      });
    }
  
    patch<T>(endpoint: string, data: any) {
      return this.request<T>(endpoint, {
        method: 'PATCH',
        body: data,
      });
    }
  
    delete<T>(endpoint: string) {
      return this.request<T>(endpoint, { method: 'DELETE' });
    }
    async login(username: string, password: string): Promise<LoginResponse> {
      return this.post<LoginResponse>('api/login/', { username, password });
    }
  
    async logout(): Promise<LogoutResponse> {
      return this.post<LogoutResponse>('api/logout/', {});
    }

    async getEmployees(): Promise<Employee[]> {
      return this.get<Employee[]>('dictionary/get_employees/');
    }

    async getCurrentUser(): Promise<Employee> {
      return this.get<Employee>('api/get_current_user/');
    }
    async getDictianaryList(): Promise<string[]>{
      return this.get('dictionary/get_dictionaries_list/');
    }
  }
  
  // Создаем экземпляр API клиента
  export const api = new ApiClient({
    baseURL: 'http://localhost:8000/'
  });
  