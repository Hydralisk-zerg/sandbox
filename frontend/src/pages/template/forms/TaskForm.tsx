// forms/TaskForm.tsx
import React from 'react';
import { Input, Select, DatePicker } from 'antd';
import { BaseForm } from './BaseForm';
import { Project } from '../types';

interface TaskFormProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
  projects: Project[];
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onClose,
  projects
}) => {
  const fields = [
    {
      name: 'taskName',
      label: 'Название задачи',
      rules: [{ required: true }],
      component: <Input />
    },
    {
      name: 'description',
      label: 'Описание',
      rules: [{ required: true }],
      component: <Input.TextArea />
    },
    {
      name: 'projectId',
      label: 'Проект',
      component: (
        <Select allowClear>
          {projects.map(project => (
            <Select.Option key={project.id} value={project.id}>
              {project.projectName}
            </Select.Option>
          ))}
        </Select>
      )
    },
    {
      name: 'status',
      label: 'Статус',
      rules: [{ required: true }],
      component: (
        <Select>
          <Select.Option value="todo">К выполнению</Select.Option>
          <Select.Option value="in-progress">В процессе</Select.Option>
          <Select.Option value="done">Выполнено</Select.Option>
        </Select>
      )
    },
    {
      name: 'priority',
      label: 'Приоритет',
      rules: [{ required: true }],
      component: (
        <Select>
          <Select.Option value="low">Низкий</Select.Option>
          <Select.Option value="medium">Средний</Select.Option>
          <Select.Option value="high">Высокий</Select.Option>
        </Select>
      )
    },
    {
      name: 'dueDate',
      label: 'Срок выполнения',
      rules: [{ required: true }],
      component: <DatePicker style={{ width: '100%' }} />
    }
  ];

  return (
    <BaseForm
      title="Создание задачи"
      fields={fields}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};
