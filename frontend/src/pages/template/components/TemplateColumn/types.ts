// components/TemplatesColumn/types.ts
import { Template } from '../../types';

export interface TemplatesColumnProps {
  templates: Template[];
  loading?: boolean;
  error?: string;
  onTemplateAdd: (template: Omit<Template, 'id'>) => void;
  onTemplateDelete: (templateId: string) => void;
  onTemplateEdit: (template: Template) => void;
  onTemplateUse: (template: Template) => void;
}
