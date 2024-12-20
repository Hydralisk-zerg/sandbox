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
export interface Procedure extends BaseItem{
  linkedItems: {
    tasks: string[];      // ID связанных задач
    events: string[];     // ID связанных событий
    data: string[];  // ID связанных шаблонов
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

export interface Data extends BaseItem {
  fieldName: string;
  fieldType: 'text' | 'number' | 'date' | 'select' | 'employees'; // додано 'employees'
  sourceTable?: string;
  sourceColumn?: string;
  createdAt: string;
}

// Типы элементов
export enum ElementType {
  EVENT = 'event',
  TASK = 'task',
  PROCEDURE = 'procedure'
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

export interface DataColumnProps {
  data: Data[];
  loading?: boolean; // добавляем опциональное свойство loading
  error?: string;    // добавляем опциональное свойство error
  onDataAdd: (data: Omit<Data, 'id'>) => void;
  onDataDelete: (id: string) => void;
  onDataEdit: (data: Data) => void;
}

export interface ProceduresColumnProps {
  procedures: Procedure[];
  tasks: BaseItem[];
  events: BaseItem[];
  data: BaseItem[];
  loading?: boolean;
  error?: string;
  isFiltered?: boolean;
  onProcedureAdd: (procedure: Omit<Procedure, 'id'>) => void;
  onProcedureEdit: (procedure: Procedure) => void;
  onProcedureDelete: (id: string) => void;
  onProcedureFilter: (procedure: Procedure) => void;
}
