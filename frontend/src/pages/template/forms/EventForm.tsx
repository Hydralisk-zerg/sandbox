// EventForm.tsx
import React from 'react';
import BaseForm from './BaseForm';

interface EventFormProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onClose, onSubmit }) => {
  const fields = [
    {
      name: 'eventName',
      label: 'Название события',
      rules: [{ required: true, message: 'Пожалуйста, введите название события' }]
    },
    {
      name: 'description',
      label: 'Описание',
      rules: [{ required: true, message: 'Пожалуйста, введите описание' }]
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

export default EventForm;
