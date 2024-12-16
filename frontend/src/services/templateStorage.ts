import { ProjectTemplate } from "../pages/template/types";

// services/templateStorage.ts
const TEMPLATE_STORAGE_KEY = 'project_templates';

export const templateStorage = {
    getTemplates(): ProjectTemplate[] {
        const templates = localStorage.getItem('templates');
        return templates ? JSON.parse(templates) : [];
      },
    
      saveTemplate(template: ProjectTemplate): void {
        const templates = this.getTemplates();
        templates.push(template);
        localStorage.setItem('templates', JSON.stringify(templates));
      },
    
      deleteTemplate(templateId: string): void {
        const templates = this.getTemplates();
        const filteredTemplates = templates.filter(t => t.id !== templateId);
        localStorage.setItem('templates', JSON.stringify(filteredTemplates));
      }
};
