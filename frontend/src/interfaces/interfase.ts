// interfaces/interface.ts

// Базовые интерфейсы
export interface Department {
  id: number;
  name: string;
}

export interface Position {
  id: number;
  name: string;
}

// Пользователи
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

// Аутентификация
export interface LoginResponse {
  detail: string;
}

export interface LogoutResponse {
  detail: string;
}

// Справочники
export interface CountryData {
  id: number;
  name_en: string;
  name_uk: string;
  alpha2: string;
  alpha3: string;
  numeric?: string;
}

// События
export interface Event {
  id: string;
  title: string;
  name?: string;
  description?: string;
  date: string;
  time: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

// Проекты
export interface Project {
  id: string;
  title: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'pending';
}

// Задачи
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

// Шаблоны
export interface Template {
  id: string;
  name: string;
  description?: string;
  type: 'project' | 'task' | 'event';
  content: any;
  created_by?: number;
  created_at?: string;
  linkedItems: {
    events: string[];
    tasks: string[];
    templates: string[];
  };
}

// Типы элементов
export enum ElementType {
  EVENT = 'event',
  TASK = 'task',
  PROJECT = 'project'
}

// API
export interface GenericDataType {
  id: number;
  [key: string]: any;
}

export interface ApiResponse {
  [key: string]: GenericDataType[];
}

// Пропсы компонентов
export interface BaseColumnProps {
  loading?: boolean;
  error?: string;
}

export interface TasksColumnProps extends BaseColumnProps {
  tasks: Task[];
  onTaskAdd: (task: Omit<Task, 'id'>) => void;
  onTaskDelete: (id: string) => void;
  onTaskEdit: (task: Task) => void;
}

export interface EventsColumnProps extends BaseColumnProps {
  events: Event[];
  onEventAdd: (event: Omit<Event, 'id'>) => void;
  onEventDelete: (eventId: string) => void;
  onEventEdit: (event: Event) => void;
}

export interface ProjectsColumnProps extends BaseColumnProps {
  projects: Project[];
  onProjectAdd: (project: Omit<Project, 'id'>) => void;
  onProjectDelete: (id: string) => void;
  onProjectEdit: (project: Project) => void;
}

export interface TemplateColumnProps extends BaseColumnProps {
  templates: Template[];
  events: Event[];
  tasks: Task[];
  onTemplateAdd: (template: Omit<Template, 'id'>) => void;
  onTemplateDelete: (id: string) => void;
  onTemplateEdit: (template: Template) => void;
  onTemplateUse: (template: Template) => void;
}