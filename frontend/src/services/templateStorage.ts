import { Project, Task, Template, Event as CustomEvent  } from "../interfaces/interfase";

export interface ProjectTemplate extends Template {
    // дополнительные поля для проектного шаблона
  }
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
            console.error(`Ошибка получения ${key}:`, error);
            return [];
        }
    },
    
    set: (key: string, data: any) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Ошибка сохранения ${key}:`, error);
            throw error;
        }
    }
};

export const projectStorage = {
    getProjects: () => storage.get(STORAGE_KEYS.PROJECTS),
    saveProjects: (projects: Project[]) => storage.set(STORAGE_KEYS.PROJECTS, projects),
    saveProject: (project: Project) => {
        try {
            const projects = storage.get(STORAGE_KEYS.PROJECTS);
            projects.push(project);
            storage.set(STORAGE_KEYS.PROJECTS, projects);
        } catch (error) {
            console.error('Ошибка сохранения проекта:', error);
            throw error;
        }
    },
    deleteProject: (projectId: string) => {
        try {
            const projects = storage.get(STORAGE_KEYS.PROJECTS);
            const filtered = projects.filter((p: Project) => p.id !== projectId);
            storage.set(STORAGE_KEYS.PROJECTS, filtered);
        } catch (error) {
            console.error('Ошибка удаления проекта:', error);
            throw error;
        }
    },
    updateProject: (updatedProject: Project) => {
        try {
            const projects = storage.get(STORAGE_KEYS.PROJECTS);
            const index = projects.findIndex((p: Project) => p.id === updatedProject.id);
            if (index !== -1) {
                projects[index] = {
                    ...updatedProject,
                    updatedAt: new Date().toISOString()
                };
                storage.set(STORAGE_KEYS.PROJECTS, projects);
            }
        } catch (error) {
            console.error('Ошибка обновления проекта:', error);
            throw error;
        }
    }
};

export const taskStorage = {
    getTasks: () => storage.get(STORAGE_KEYS.TASKS),
    saveTasks: (tasks: Task[]) => storage.set(STORAGE_KEYS.TASKS, tasks),
    saveTask: (task: Task) => {
        try {
            const tasks = storage.get(STORAGE_KEYS.TASKS);
            tasks.push(task);
            storage.set(STORAGE_KEYS.TASKS, tasks);
        } catch (error) {
            console.error('Ошибка сохранения задачи:', error);
            throw error;
        }
    },
    deleteTask: (taskId: string) => {
        try {
            const tasks = storage.get(STORAGE_KEYS.TASKS);
            const filtered = tasks.filter((t: Task) => t.id !== taskId);
            storage.set(STORAGE_KEYS.TASKS, filtered);
        } catch (error) {
            console.error('Ошибка удаления задачи:', error);
            throw error;
        }
    },
    updateTask: (updatedTask: Task) => {
        try {
            const tasks = storage.get(STORAGE_KEYS.TASKS);
            const index = tasks.findIndex((t: Task) => t.id === updatedTask.id);
            if (index !== -1) {
                tasks[index] = {
                    ...updatedTask,
                    updatedAt: new Date().toISOString()
                };
                storage.set(STORAGE_KEYS.TASKS, tasks);
            }
        } catch (error) {
            console.error('Ошибка обновления задачи:', error);
            throw error;
        }
    }
};

export const templateStorage = {
    getTemplates: () => storage.get(STORAGE_KEYS.TEMPLATES),
    
    saveTemplates: (templates: Template[]) => {
        try {
            storage.set(STORAGE_KEYS.TEMPLATES, templates);
        } catch (error) {
            console.error('Ошибка сохранения шаблонов:', error);
            throw error;
        }
    },

    saveTemplate: (templateData: Omit<Template, 'id'>) => {
        try {
            const templates = storage.get(STORAGE_KEYS.TEMPLATES) || [];
            const newTemplate = {
                name: templateData.name,
                description: templateData.description,
                id: uuidv4(),
            };
            templates.push(newTemplate);
            storage.set(STORAGE_KEYS.TEMPLATES, templates);
            return newTemplate;
        } catch (error) {
            console.error('Ошибка сохранения шаблона:', error);
            throw error;
        }
    },

    deleteTemplate: (templateId: string) => {
        try {
            const templates = storage.get(STORAGE_KEYS.TEMPLATES) || [];
            const filteredTemplates = templates.filter((t: Template) => t.id !== templateId);
            storage.set(STORAGE_KEYS.TEMPLATES, filteredTemplates);
        } catch (error) {
            console.error('Ошибка удаления шаблона:', error);
            throw error;
        }
    },

    updateTemplate: (updatedTemplate: Template) => {
        try {
            const templates = storage.get(STORAGE_KEYS.TEMPLATES) || [];
            const index = templates.findIndex((t: Template) => t.id === updatedTemplate.id);
            
            if (index !== -1) {
                templates[index] = {
                    name: updatedTemplate.name,
                    description: updatedTemplate.description,
                    id: updatedTemplate.id,
                };
                storage.set(STORAGE_KEYS.TEMPLATES, templates);
                return templates[index];
            }
        } catch (error) {
            console.error('Ошибка обновления шаблона:', error);
            throw error;
        }
    }
};


export const eventStorage = {
    getEvents: () => storage.get(STORAGE_KEYS.EVENTS),
    saveEvents: (events: CustomEvent[]) => storage.set(STORAGE_KEYS.EVENTS, events),
    saveEvent: (event: CustomEvent) => {
        try {
            const events = storage.get(STORAGE_KEYS.EVENTS);
            events.push(event);
            storage.set(STORAGE_KEYS.EVENTS, events);
        } catch (error) {
            console.error('Ошибка сохранения события:', error);
            throw error;
        }
    },
    deleteEvent: (eventId: string) => {
        try {
            const events = storage.get(STORAGE_KEYS.EVENTS);
            const filtered = events.filter((e: CustomEvent) => e.id !== eventId);
            storage.set(STORAGE_KEYS.EVENTS, filtered);
        } catch (error) {
            console.error('Ошибка удаления события:', error);
            throw error;
        }
    },
    updateEvent: (updatedEvent: CustomEvent) => {
        try {
            const events = storage.get(STORAGE_KEYS.EVENTS);
            const index = events.findIndex((e: CustomEvent) => e.id === updatedEvent.id);
            if (index !== -1) {
                events[index] = {
                    ...updatedEvent,
                    updatedAt: new Date().toISOString()
                };
                storage.set(STORAGE_KEYS.EVENTS, events);
            }
        } catch (error) {
            console.error('Ошибка обновления события:', error);
            throw error;
        }
    }
};
function uuidv4() {
    throw new Error("Function not implemented.");
}

