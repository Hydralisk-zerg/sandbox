// forms/EventForm.tsx
import React from 'react';
import { Input, Select, DatePicker, TimePicker } from 'antd';
import { BaseForm } from './BaseForm';
import { Project } from '../types';

interface EventFormProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
  projects: Project[];
}

export const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  onClose,
  projects
}) => {
  const fields = [
    {
      name: 'eventName',
      label: 'Название события',
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
      name: 'date',
      label: 'Дата',
      rules: [{ required: true }],
      component: <DatePicker style={{ width: '100%' }} />
    },
    {
      name: 'time',
      label: 'Время',
      rules: [{ required: true }],
      component: <TimePicker style={{ width: '100%' }} />
    }
  ];

  return (
    <BaseForm
      title="Создание события"
      fields={fields}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};
