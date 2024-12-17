import { ProjectTemplate } from "../pages/template/types";

const TEMPLATE_STORAGE_KEY = 'templates'; // Используем константу

export const templateStorage = {
    getTemplates(): ProjectTemplate[] {
        try {
            const templates = localStorage.getItem(TEMPLATE_STORAGE_KEY);
            return templates ? JSON.parse(templates) : [];
        } catch (error) {
            console.error('Error getting templates:', error);
            return [];
        }
    },
    
    saveTemplate(template: ProjectTemplate): void {
        try {
            const templates = this.getTemplates();
            templates.push(template);
            localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
        } catch (error) {
            console.error('Error saving template:', error);
            throw error;
        }
    },
    
    deleteTemplate(templateId: string): void {
        try {
            const templates = this.getTemplates();
            const filteredTemplates = templates.filter(t => t.id !== templateId);
            localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(filteredTemplates));
        } catch (error) {
            console.error('Error deleting template:', error);
            throw error;
        }
    },

    updateTemplate(updatedTemplate: ProjectTemplate): void {
      try {
          const templates = this.getTemplates();
          const index = templates.findIndex(t => t.id === updatedTemplate.id);
          if (index !== -1) {
              templates[index] = {
                  ...updatedTemplate,
                  updatedAt: new Date().toISOString()
              };
              localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
          }
      } catch (error) {
          console.error('Error updating template:', error);
          throw error;
      }
  }
};
