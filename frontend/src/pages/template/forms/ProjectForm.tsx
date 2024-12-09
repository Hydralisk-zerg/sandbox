// ProjectForm.tsx
import React from 'react';
import BaseForm from './BaseForm';

interface ProjectFormProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
}

interface ProjectFormValues {
  projectName: string;
  description: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onClose, onSubmit }) => {
  const fields = [
    {
      name: 'projectName',
      label: 'Название проекта',
      rules: [{ required: true, message: 'Пожалуйста, введите название проекта' }]
    },
    {
      name: 'description',
      label: 'Описание',
      rules: [{ required: true, message: 'Пожалуйста, введите описание' }]
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

export default ProjectForm;
