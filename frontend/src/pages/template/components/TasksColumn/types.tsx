// components/TasksColumn/types.ts
import { Task } from '../../types';

export interface TasksColumnProps {
  tasks: Task[];
  loading?: boolean;
  error?: string;
  onTaskAdd: (task: Omit<Task, 'id'>) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
}
