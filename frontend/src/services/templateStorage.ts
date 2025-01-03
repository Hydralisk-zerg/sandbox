import { Procedure, Task, Data, Event as CustomEvent  } from "../interfaces/interfase";

export interface ProcedureData extends Data {
    // дополнительные поля для проектного шаблона
  }
// Константы для ключей хранилища
const STORAGE_KEYS = {
    PROCEDURES: 'procedures',
    TASKS: 'tasks',
    EVENTS: 'events',
    DATA: 'data'
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

export const procedureStorage = {
    getProcedures: () => storage.get(STORAGE_KEYS.PROCEDURES),
    saveProcedures: (procedures: Procedure[]) => storage.set(STORAGE_KEYS.PROCEDURES, procedures),
    saveProcedure: (procedure: Procedure) => {
        try {
            const procedures = storage.get(STORAGE_KEYS.PROCEDURES);
            procedures.push(procedure);
            storage.set(STORAGE_KEYS.PROCEDURES, procedures);
        } catch (error) {
            console.error('Ошибка сохранения проекта:', error);
            throw error;
        }
    },
    deleteProcedure: (procedureId: string) => {
        try {
            const procedures = storage.get(STORAGE_KEYS.PROCEDURES);
            const filtered = procedures.filter((p: Procedure) => p.id !== procedureId);
            storage.set(STORAGE_KEYS.PROCEDURES, filtered);
        } catch (error) {
            console.error('Ошибка удаления проекта:', error);
            throw error;
        }
    },
    updateProcedure: (updatedProcedure: Procedure) => {
        try {
            const procedures = storage.get(STORAGE_KEYS.PROCEDURES);
            const index = procedures.findIndex((p: Procedure) => p.id === updatedProcedure.id);
            if (index !== -1) {
                procedures[index] = {
                    ...updatedProcedure,
                    updatedAt: new Date().toISOString()
                };
                storage.set(STORAGE_KEYS.PROCEDURES, procedures);
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
    
    saveTask: (task: Omit<Task, 'id'>) => {
        try {
            const tasks = storage.get(STORAGE_KEYS.TASKS) || [];
            const newTask = {
                ...task,
                name: task.name, // преобразуем title в name
                id: uuidv4(),
                department: task.department || '',
                employee: task.employee || '',
                status: task.status || '', // Значение по умолчанию
            priority: task.priority || '', // Значение по умолчанию
                linkedItems: task.linkedItems || {},
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
       // удаляем title, так как теперь используем name
            tasks.push(newTask);
            storage.set(STORAGE_KEYS.TASKS, tasks);
            return newTask;
        } catch (error) {
            console.error('Ошибка сохранения задачи:', error);
            throw error;
        }
    },
    
    deleteTask: (taskId: string) => {
        try {
            const tasks = storage.get(STORAGE_KEYS.TASKS) || [];
            const filtered = tasks.filter((t: Task) => t.id !== taskId);
            storage.set(STORAGE_KEYS.TASKS, filtered);
        } catch (error) {
            console.error('Ошибка удаления задачи:', error);
            throw error;
        }
    },
    
    updateTask: (updatedTask: Task) => {
        try {
            const tasks = storage.get(STORAGE_KEYS.TASKS) || [];
            const index = tasks.findIndex((t: Task) => t.id === updatedTask.id);
            
            if (index !== -1) {
                tasks[index] = {
                    ...updatedTask,
                    name: updatedTask.name,
                    department: updatedTask.department || tasks[index].department,
                    employee: updatedTask.employee || tasks[index].employee,
                    // Сохраняем status и priority
                    status: updatedTask.status || tasks[index].status,
                    priority: updatedTask.priority || tasks[index].priority,
                    linkedItems: {
                        ...tasks[index].linkedItems,
                        ...updatedTask.linkedItems
                    },
                    updatedAt: new Date().toISOString()
                };
                delete tasks[index].title;
                storage.set(STORAGE_KEYS.TASKS, tasks);
                return tasks[index];
            }
        } catch (error) {
            console.error('Ошибка обновления задачи:', error);
            throw error;
        }
    }
};


export const dataStorage = {
    getData: () => storage.get(STORAGE_KEYS.DATA),
    
    saveData: (data: Data[]) => {
        try {
            storage.set(STORAGE_KEYS.DATA, data);
        } catch (error) {
            console.error('Ошибка сохранения шаблонов:', error);
            throw error;
        }
    },

    saveDataAll: (dataData: Omit<Data, 'id'>) => {
        try {
            const data = storage.get(STORAGE_KEYS.DATA) || [];
            const newData = {
                name: dataData.name,
                description: dataData.description,
                id: uuidv4(),
            };
            data.push(newData);
            storage.set(STORAGE_KEYS.DATA, data);
            return newData;
        } catch (error) {
            console.error('Ошибка сохранения шаблона:', error);
            throw error;
        }
    },

    deleteData: (dataId: string) => {
        try {
            const data = storage.get(STORAGE_KEYS.DATA) || [];
            const filteredData = data.filter((t: Data) => t.id !== dataId);
            storage.set(STORAGE_KEYS.DATA, filteredData);
        } catch (error) {
            console.error('Ошибка удаления шаблона:', error);
            throw error;
        }
    },

    updateData: (updatedData: Data) => {
        try {
            const data = storage.get(STORAGE_KEYS.DATA) || [];
            const index = data.findIndex((t: Data) => t.id === updatedData.id);
            
            if (index !== -1) {
                data[index] = {
                    name: updatedData.name,
                    description: updatedData.description,
                    id: updatedData.id,
                };
                storage.set(STORAGE_KEYS.DATA, data);
                return data[index];
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

