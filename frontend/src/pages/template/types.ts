// src/pages/template/types.ts

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

export interface Project {
  id: string;
  title: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'pending';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export interface Template {
  id: string;
  title: string;
  name: string;
  description?: string;
  type: 'project' | 'task' | 'event';
  content: any;
  createdAt: string;
}


export enum ElementType {
  EVENT = 'event',
  TASK = 'task',
  PROJECT = 'project'
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description?: string; // Делаем description опциональным
  elements: Array<{
    type: ElementType;
    label: string;
    value: any;
  }>;
  updatedAt?: string; // Добавляем поле updatedAt
  createdAt?: string;
  createdBy?: number;
  connections?: any[];
}

