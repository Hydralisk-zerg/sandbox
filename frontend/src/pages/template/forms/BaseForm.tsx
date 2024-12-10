// forms/BaseForm.tsx
import React from 'react';
import { Form, Button } from 'antd';
import { BaseFormProps } from '../types';

const formStyles = {
  form: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px'
  },
  title: {
    marginBottom: '20px',
    textAlign: 'center' as const
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  }
};

export const BaseForm: React.FC<BaseFormProps> = ({
  title,
  fields,
  onSubmit,
  onClose
}) => {
  const [form] = Form.useForm();

  return (
    <div style={formStyles.form}>
      <h2 style={formStyles.title}>{title}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(values);
          form.resetFields();
        }}
      >
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules}
          >
            {field.component}
          </Form.Item>
        ))}
        <div style={formStyles.buttons}>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="primary" htmlType="submit">
            Создать
          </Button>
        </div>
      </Form>
    </div>
  );
};
