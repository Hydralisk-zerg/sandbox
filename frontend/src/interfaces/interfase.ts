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

export interface BaseItem {
  id: string;
  name: string;
  description: string;
}

// События
export interface Event extends BaseItem{
  date: string;
  time: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

// Проекты
export interface Project extends BaseItem{
  linkedItems: {
    tasks: string[];      // ID связанных задач
    events: string[];     // ID связанных событий
    templates: string[];  // ID связанных шаблонов
  };
  status: 'active' | 'completed' | 'pending';
}
// Задачи
export interface Task extends BaseItem{
  dueDate: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

// Шаблоны

export interface Template extends BaseItem{
  createdAt: string;
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
  tasks: Task[];         // Добавляем существующие задачи
  events: Event[];       // Добавляем существующие события
  templates: Template[]; // Добавляем существующие шаблоны
  onProjectAdd: (project: Omit<Project, 'id'>) => void;
  onProjectDelete: (id: string) => void;
  onProjectEdit: (project: Project) => void;
}

export interface TemplateColumnProps {
  templates: Template[];
  loading?: boolean; // добавляем опциональное свойство loading
  error?: string;    // добавляем опциональное свойство error
  onTemplateAdd: (template: Omit<Template, 'id'>) => void;
  onTemplateDelete: (id: string) => void;
  onTemplateEdit: (template: Template) => void;
}
