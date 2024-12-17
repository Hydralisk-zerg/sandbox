// src/utils/storage.ts

import { Project, Task, Template, Event } from "../pages/template/types";

// Константы для ключей хранилища
const STORAGE_KEYS = {
    PROJECTS: 'projects',
    TASKS: 'tasks',
    EVENTS: 'events',
    TEMPLATES: 'templates'
  };
  
  // Общие функции для работы с localStorage
  const storage = {
    get: (key: string) => {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error(`Error getting ${key}:`, error);
        return [];
      }
    },
    
    set: (key: string, data: any) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error(`Error saving ${key}:`, error);
      }
    }
  };
  
  // Специфические функции для каждого типа данных
  export const projectStorage = {
    getProjects: () => storage.get(STORAGE_KEYS.PROJECTS),
    saveProjects: (projects: Project[]) => storage.set(STORAGE_KEYS.PROJECTS, projects)
  };
  
  export const taskStorage = {
    getTasks: () => storage.get(STORAGE_KEYS.TASKS),
    saveTasks: (tasks: Task[]) => storage.set(STORAGE_KEYS.TASKS, tasks)
  };
  
  export const eventStorage = {
    getEvents: () => storage.get(STORAGE_KEYS.EVENTS),
    saveEvents: (events: Event[]) => storage.set(STORAGE_KEYS.EVENTS, events)
  };
  
  export const templateStorage = {
    getTemplates: () => storage.get(STORAGE_KEYS.TEMPLATES),
    saveTemplates: (templates: Template[]) => storage.set(STORAGE_KEYS.TEMPLATES, templates)
  };
  