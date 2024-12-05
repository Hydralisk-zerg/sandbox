import React, { useState, useEffect } from 'react';
import { Form, Button, Select, Space } from 'antd';

const { Option } = Select;

interface Template {
  id: string;
  name: string;
  created_at: string;
  task_groups: any[];
}

interface CreateTaskFormProps {
  onCreateTemplate: () => void;
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
  selectedTemplate: Template | null;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ 
  onCreateTemplate, 
  templates,
  onTemplateSelect,
  selectedTemplate
}) => {
  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      onTemplateSelect(template);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Space>
        <Select
          placeholder="Выберите шаблон"
          style={{ width: '300px' }}
          value={selectedTemplate?.id}
          onChange={handleTemplateChange}
          allowClear
        >
          {templates.map(template => (
            <Option key={template.id} value={template.id}>
              {template.name} ({new Date(template.created_at).toLocaleString()})
            </Option>
          ))}
        </Select>
        <Button 
          type="primary" 
          ghost
          onClick={onCreateTemplate}
        >
          Создать шаблон
        </Button>
        <Button 
          type="primary"
          ghost
          disabled={!selectedTemplate}
        >
          Создать задачу
        </Button>
      </Space>

      {selectedTemplate && (
        <div>
          {/* Отображение задач из выбранного шаблона */}
          {selectedTemplate.task_groups.map((group, index) => (
            <div key={index}>
              {/* Отображение групп задач */}
              {group.tasks.map((task: string, taskIndex: number) => (
                <div key={taskIndex}>{task}</div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateTaskForm;
