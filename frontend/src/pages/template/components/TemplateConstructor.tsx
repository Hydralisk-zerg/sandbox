// src/pages/template/components/TemplateConstructor.tsx

import React, { useState } from 'react';
import { ElementType, ProjectTemplate } from '../types';

interface TemplateConstructorProps {
  template?: ProjectTemplate;
}

const TemplateConstructor: React.FC<TemplateConstructorProps> = ({ template }) => {
  const [currentTemplate, setCurrentTemplate] = useState<ProjectTemplate>(() => 
    template || {
      id: crypto.randomUUID(),
      name: '',
      elements: [],
      connections: [],
      createdBy: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  );

  const onAddElement = (type: ElementType) => {
    // Реализация добавления элемента
  };

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

export default TemplateConstructor;
