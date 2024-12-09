// TaskForm.tsx
import React from 'react';
import BaseForm from './BaseForm';

interface TaskFormProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, onSubmit }) => {
  const fields = [
    {
      name: 'taskName',
      label: 'Название задачи',
      rules: [{ required: true, message: 'Пожалуйста, введите название задачи' }]
    },
    {
      name: 'description',
      label: 'Описание',
      rules: [{ required: true, message: 'Пожалуйста, введите описание' }]
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

export default TaskForm;
