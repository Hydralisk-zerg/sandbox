// template/components/TemplateConstructor.tsx
import React, { useState } from 'react';
import { ElementType, ProjectTemplate } from '../types';

interface TemplateConstructorProps {
  template?: ProjectTemplate;
  onSave: (template: ProjectTemplate) => void;
}

export const TemplateConstructor: React.FC<TemplateConstructorProps> = ({
  template,
  onSave
}) => {
    const [currentTemplate, setCurrentTemplate] = useState<ProjectTemplate>(
        template || {
          id: crypto.randomUUID(),
          name: '',
          description: '', // Добавляем обязательное поле description
          elements: [],
          connections: [],
          createdBy: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
      

  return (
    <div className="template-constructor">
      {/* Здесь будет визуальный конструктор */}
    </div>
  );
};

// template/components/ElementPanel.tsx
interface ElementPanelProps {
  onAddElement: (type: ElementType) => void;
}

export const ElementPanel: React.FC<ElementPanelProps> = ({ onAddElement }) => {
  return (
    <div className="element-panel">
      <button onClick={() => onAddElement(ElementType.EVENT)}>
        Добавить событие
      </button>
      <button onClick={() => onAddElement(ElementType.TASK)}>
        Добавить задачу
      </button>
    </div>
  );
};
