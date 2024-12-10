// types.ts
export interface Project {
  id: string;
  projectName: string;
  description: string;
  tasks: string[];
  events: string[];
}

export interface Task {
  id: string;
  taskName: string;
  description: string;
  projectId?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

export interface Event {
  id: string;
  eventName: string;
  description: string;
  projectId?: string;
  date: string;
  time: string;
}

export interface Field {
  name: string;
  label: string;
  rules?: Array<{
    required?: boolean;
    message?: string;
  }>;
  component: React.ReactNode;
}

export interface BaseFormProps {
  title: string;
  fields: Field[];
  onSubmit: (values: any) => void;
  onClose: () => void;
}
