// BaseForm.tsx
import React from 'react';
import { Form, Input, Button } from 'antd';

interface Field {
  name: string;
  label: string;
  rules: any[];
}

interface BaseFormProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
  fields: Field[];
  title: string;
}

const formStyles = {
  container: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px'
  },
  title: {
    marginBottom: '20px'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  }
};

const BaseForm: React.FC<BaseFormProps> = ({ onSubmit, onClose, fields, title }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <div style={formStyles.container}>
      <h2 style={formStyles.title}>{title}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {fields.map(field => (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={field.rules}
          >
            <Input />
          </Form.Item>
        ))}
        <div style={formStyles.buttons}>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
          <Button onClick={onClose}>
            Отмена
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default BaseForm;
