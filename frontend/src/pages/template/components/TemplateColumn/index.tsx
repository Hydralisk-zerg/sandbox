import React, { useState } from 'react';
import { List, Button, Modal, Form, Input, Menu, Dropdown, Typography, Select, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, MoreOutlined } from '@ant-design/icons';
import { templateStorage } from '../../../../services/templateStorage';
import { v4 as uuidv4 } from 'uuid';
import { Template, TemplateColumnProps } from '../../../../interfaces/interfase';

const { Text } = Typography;




const TemplateColumn: React.FC<TemplateColumnProps> = ({
  templates,
  events,
  tasks,
  onTemplateAdd,
  onTemplateDelete,
  onTemplateEdit,
  onTemplateUse,
  loading,
  error
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [form] = Form.useForm();

  const showCreateModal = () => {
    form.resetFields();
    setEditingTemplate(null);
    setIsModalVisible(true);
  };

  const showEditModal = (template: Template) => {
    form.setFieldsValue({
      name: template.name,
      description: template.description || '',
      type: template.type,
    });
    setEditingTemplate(template);
    setIsModalVisible(true);
  };

  const handleSubmit = (values: any) => {
    if (editingTemplate) {
      onTemplateEdit({
        ...editingTemplate,
        ...values,
        updatedAt: new Date().toISOString()
      });
    } else {
      onTemplateAdd({
        ...values,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        linkedItems: {
          events: [],
          tasks: [],
          templates: []
        }
      });
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  const getMenu = (template: Template) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => showEditModal(template)}>
        <EditOutlined /> Редактировать
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => onTemplateDelete(template.id)}>
        <DeleteOutlined /> Удалить
      </Menu.Item>
      <Menu.Item key="use" onClick={() => onTemplateUse(template)}>
        Использовать шаблон
      </Menu.Item>
    </Menu>
  );

  if (error) {
    return <div style={{ padding: '16px', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '16px', background: '#fff', borderRadius: '8px', height: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <Text strong>Шаблоны</Text>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={showCreateModal}
          disabled={loading}
        >
          Создать
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      ) : (
        <List
          style={{ height: 'calc(100% - 56px)', overflowY: 'auto' }}
          dataSource={templates}
          renderItem={template => (
            <List.Item
              style={{ 
                padding: '12px', 
                borderRadius: '4px', 
                marginBottom: '8px',
                border: '1px solid #f0f0f0'
              }}
              actions={[
                <Dropdown overlay={getMenu(template)} trigger={['click']}>
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              ]}
            >
              <List.Item.Meta
                title={template.name}
                description={template.description}
              />
            </List.Item>
          )}
        />
      )}

      <Modal
        title={editingTemplate ? "Редактировать шаблон" : "Создать шаблон"}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: 'Введите название шаблона' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="type"
            label="Тип"
            rules={[{ required: true, message: 'Выберите тип шаблона' }]}
          >
            <Select>
              <Select.Option value="project">Проект</Select.Option>
              <Select.Option value="task">Задача</Select.Option>
              <Select.Option value="event">Событие</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TemplateColumn;