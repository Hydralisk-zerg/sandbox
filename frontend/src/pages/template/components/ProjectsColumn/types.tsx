// components/ProjectsColumn/types.ts
import { Project } from '../../types';

export interface ProjectsColumnProps {
  projects: Project[];
  loading?: boolean;
  error?: string;
  onProjectAdd: (project: Omit<Project, 'id'>) => void;
  onProjectDelete: (projectId: string) => void;
  onProjectEdit: (project: Project) => void;
}
