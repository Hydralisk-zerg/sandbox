import React from 'react';
import { Modal, Typography, Form, Input, Select, DatePicker, InputNumber, Space } from 'antd';
// import { Task, Event } from '../../../../interfaces/interfase';

const { Title, Text } = Typography;



interface Task {
    id: string;
    name: string;
    description: string;
    dueDate: string;
    status: string;
    priority: string;
  }
  
  interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    time: string;
    status: string;
    priority: string;
  }
  
  interface FormField {
    id: string;
    name: string;
    fieldName: string;
    description: string;
    fieldType: string;
    sourceTable?: string;
    sourceColumn?: string;
    createdAt?: string;
    employeeField?: number;
  }
  
  interface ModalProps {
    tasks: Task[];
    events: Event[];
    data: FormField[];
    isVisible: boolean;
    onClose: () => void;
  }
  
const ProcedureDetailsModal: React.FC<ModalProps> = ({
  tasks,
  events,
  data,
  isVisible,
  onClose
}) => {
  const [form] = Form.useForm();

  const renderFormField = (fieldType: string, placeholder: string) => {
    switch (fieldType.toLowerCase()) {
      case 'text':
        return <Input placeholder={placeholder} />;
      case 'number':
        return <InputNumber style={{ width: '100%' }} placeholder={placeholder} />;
      case 'select':
        return (
          <Select
            style={{ width: '100%' }}
            placeholder={placeholder}
            options={[]}
          />
        );
      case 'date':
        return <DatePicker style={{ width: '100%' }} placeholder={placeholder} />;
      case 'employees':
        return (
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder={placeholder}
            options={[]}
          />
        );
      default:
        return <Input placeholder={placeholder} />;
    }
  };

  const handleSubmit = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <Modal
      title={<Title level={4}>Деталі процедури</Title>}
      open={isVisible}
      onCancel={onClose}
      onOk={() => form.submit()}
      width={800}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Секція для Tasks */}
        {tasks.map(task => (
          <div key={task.id}>
            <Form.Item label="Назва задачі">
              <Input defaultValue={task.name} />
            </Form.Item>
            <Form.Item label="Опис задачі">
              <Input.TextArea defaultValue={task.description} />
            </Form.Item>
          </div>
        ))}

        {/* Секція для Events */}
        {events.map(event => (
          <div key={event.id}>
            <Form.Item label="Назва події">
              <Input defaultValue={event.name} />
            </Form.Item>
            <Form.Item label="Опис події">
              <Input.TextArea defaultValue={event.description} />
            </Form.Item>
          </div>
        ))}

        {/* Динамічна форма на основі data */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {data.map(field => (
            <Form.Item
              key={field.id}
              label={field.fieldName}
              name={field.fieldName}
            >
              {renderFormField(field.fieldType, field.description)}
            </Form.Item>
          ))}
        </Form>
      </Space>
    </Modal>
  );
};

export default ProcedureDetailsModal;
