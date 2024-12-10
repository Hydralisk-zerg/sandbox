// forms/ProjectForm.tsx
import React from 'react';
import { Input, Select } from 'antd';
import { BaseForm } from './BaseForm';
import { Task, Event } from '../types';

interface ProjectFormProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
  tasks: Task[];
  events: Event[];
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  onClose,
  tasks,
  events
}) => {
  const fields = [
    {
      name: 'projectName',
      label: 'Название проекта',
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
      name: 'tasks',
      label: 'Задачи',
      component: (
        <Select mode="multiple">
          {tasks.filter(task => !task.projectId).map(task => (
            <Select.Option key={task.id} value={task.id}>
              {task.taskName}
            </Select.Option>
          ))}
        </Select>
      )
    },
    {
      name: 'events',
      label: 'События',
      component: (
        <Select mode="multiple">
          {events.filter(event => !event.projectId).map(event => (
            <Select.Option key={event.id} value={event.id}>
              {event.eventName}
            </Select.Option>
          ))}
        </Select>
      )
    }
  ];

  return (
    <BaseForm
      title="Создание проекта"
      fields={fields}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};
