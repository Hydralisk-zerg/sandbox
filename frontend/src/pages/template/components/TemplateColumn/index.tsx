// components/TemplatesColumn/index.tsx
import React, { useState } from 'react';
import {
  Card,
  List,
  Button,
  Typography,
  Popconfirm,
  Empty,
  Alert,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CopyOutlined,
  SnippetsOutlined
} from '@ant-design/icons';
import { Template } from '../../types';
import { TemplatesColumnProps } from './types';
import { Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const TemplatesColumn: React.FC<TemplatesColumnProps> = ({
  templates,
  loading = false,
  error,
  onTemplateAdd,
  onTemplateDelete,
  onTemplateEdit,
  onTemplateUse
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [form] = Form.useForm();

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingTemplate) {
        onTemplateEdit({ ...editingTemplate, ...values });
      } else {
        onTemplateAdd(values);
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingTemplate(null);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingTemplate(null);
  };

  const showEditModal = (template: Template) => {
    setEditingTemplate(template);
    form.setFieldsValue(template);
    setIsModalVisible(true);
  };

  const getTypeColor = (type: string | undefined) => {
    if (!type) return 'default';

    const colors: Record<string, string> = {
      'task': 'blue',
      'project': 'green',
      'event': 'purple'
    };
    return colors[type.toLowerCase()] || 'default';
  };

  const renderContent = () => {
    if (error) {
      return (
        <Alert
          message="Ошибка"
          description={error}
          type="error"
          showIcon
        />
      );
    }

    return (
      <List
        loading={loading}
        dataSource={templates}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Нет шаблонов"
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Создать первый шаблон
              </Button>
            </Empty>
          )
        }}
        renderItem={(template) => (
          <List.Item
            key={template.id}
            actions={[
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key="use"
                      icon={<CopyOutlined />}
                      onClick={() => onTemplateUse(template)}
                    >
                      Использовать
                    </Menu.Item>
                    <Menu.Item
                      key="edit"
                      icon={<EditOutlined />}
                      onClick={() => showEditModal(template)}
                    >
                      Редактировать
                    </Menu.Item>
                    <Menu.Item
                      key="delete"
                      danger
                      icon={<DeleteOutlined />}
                    >
                      <Popconfirm
                        title="Удалить шаблон?"
                        description="Это действие нельзя отменить"
                        onConfirm={() => onTemplateDelete(template.id)}
                        okText="Да"
                        cancelText="Нет"
                      >
                        Удалить
                      </Popconfirm>
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}
              >
                <Button type="link" icon={<MoreOutlined />} />
              </Dropdown>
            ]}
          >
            <List.Item.Meta
              avatar={<SnippetsOutlined style={{ fontSize: '24px' }} />}
              title={
                <Space>
                  {template.name}
                  <Tag color={getTypeColor(template.type)}>
                    {template.type || 'unknown'}
                  </Tag>
                </Space>
              }
              description={
                template.description && (
                  <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                    {template.description}
                  </Paragraph>
                )
              }
            />
          </List.Item>

        )}
        style={{
          height: 'calc(100vh - 200px)',
          overflowY: 'auto'
        }}
      />
    );
  };

  return (
    <>
      <Card
        title={<Title level={4}>Журнал</Title>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            disabled={loading}
            ghost
          >
            Добавить данные
          </Button>
        }
        style={{ width: '100%', height: '100%' }}
      >
        {renderContent()}
      </Card>

      <Modal
        title={editingTemplate ? "Редактировать шаблон" : "Создать шаблон"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingTemplate ? "Сохранить" : "Создать"}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout="vertical"
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
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="type"
            label="Тип"
            rules={[{ required: true, message: 'Выберите тип шаблона' }]}
          >
            <Select>
              <Select.Option value="task">Задача</Select.Option>
              <Select.Option value="project">Проект</Select.Option>
              <Select.Option value="event">Событие</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="Содержимое шаблона"
            rules={[{ required: true, message: 'Введите содержимое шаблона' }]}
          >
            <TextArea rows={6} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TemplatesColumn