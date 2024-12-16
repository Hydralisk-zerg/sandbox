import React, { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  Button,
  Empty,
  Card,
  Modal,
  Form,
  Input,
  Space,
  Row,
  Col,
  notification,
  Input as AntInput
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ClearOutlined
} from '@ant-design/icons';
import { ProjectTemplate } from './types';
import { templateStorage } from '../../services/templateStorage';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Search } = AntInput;

const Template: React.FC = () => {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ProjectTemplate[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [searchQuery, templates]);

  const loadTemplates = () => {
    try {
      console.log('Loading templates...');
      const loadedTemplates = templateStorage.getTemplates();
      console.log('Loaded templates:', loadedTemplates);
      setTemplates(loadedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      notification.error({
        message: 'Ошибка загрузки',
        description: 'Не удалось загрузить шаблоны'
      });
    }
  };

  const filterTemplates = () => {
    console.log('Filtering templates with query:', searchQuery);
    const filtered = templates.filter(template => {
      const searchLower = searchQuery.toLowerCase();
      return (
        template.name.toLowerCase().includes(searchLower) ||
        (template.description?.toLowerCase() || '').includes(searchLower) || // Добавлена проверка
        new Date(template.updatedAt).toLocaleDateString().includes(searchLower) ||
        template.elements.length.toString().includes(searchLower)
      );
    });
    console.log('Filtered templates:', filtered);
    setFilteredTemplates(filtered);
  };

  const handleCreateTemplate = (values: any) => {
    try {
      console.log('Creating new template with values:', values);
      const newTemplate: ProjectTemplate = {
        id: crypto.randomUUID(),
        name: values.name,
        description: values.description,
        elements: [],
        connections: [],
        createdBy: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      templateStorage.saveTemplate(newTemplate);
      console.log('Template created successfully:', newTemplate);

      loadTemplates();
      setIsModalVisible(false);
      form.resetFields();

      notification.success({
        message: 'Успешно',
        description: 'Шаблон успешно создан'
      });
    } catch (error) {
      console.error('Error creating template:', error);
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось создать шаблон'
      });
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    Modal.confirm({
      title: 'Подтверждение удаления',
      content: 'Вы уверены, что хотите удалить этот шаблон?',
      okText: 'Да',
      cancelText: 'Нет',
      onOk: () => {
        try {
          console.log('Deleting template:', templateId);
          // Добавить логику удаления
          templateStorage.deleteTemplate(templateId);
          loadTemplates();

          notification.success({
            message: 'Успешно',
            description: 'Шаблон успешно удален'
          });
        } catch (error) {
          console.error('Error deleting template:', error);
          notification.error({
            message: 'Ошибка',
            description: 'Не удалось удалить шаблон'
          });
        }
      }
    });
  };

  return (
    <Layout>
      <Card>
        <Content style={{ padding: '24px' }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
            <Col>
              <Title level={2}>Шаблоны проектов</Title>
            </Col>
            <Col>
              <Space>
                <Input
                  placeholder="Поиск шаблонов"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: 300 }}
                />
                <Button
                  type="primary"
                  ghost
                  danger={searchQuery.length > 0}
                  icon={<ClearOutlined />}
                  onClick={() => setSearchQuery('')}
                />
                <Button
                  type="primary"
                  ghost
                  icon={<PlusOutlined />}
                  onClick={() => setIsModalVisible(true)}
                >
                  Создать шаблон
                </Button>
              </Space>

            </Col>
          </Row>

          {filteredTemplates.length === 0 ? (
            <Empty
              description={searchQuery ? "Ничего не найдено" : "Шаблоны отсутствуют"}
              style={{ margin: '40px 0' }}
            >
              {!searchQuery && (
                <Button
                  type="primary"
                  onClick={() => setIsModalVisible(true)}
                >
                  Создать первый шаблон
                </Button>
              )}
            </Empty>
          ) : (
            <Row gutter={[16, 16]}>
              {filteredTemplates.map(template => (
                <Col xs={24} sm={12} md={8} lg={6} key={template.id}>
                  <Card
                    actions={[
                      <EditOutlined key="edit" />,
                      <DeleteOutlined
                        key="delete"
                        onClick={() => handleDeleteTemplate(template.id)}
                      />
                    ]}
                  >
                    <Card.Meta
                      title={template.name}
                      description={template.description}
                    />
                    <div style={{ marginTop: 16 }}>
                      <Space direction="vertical" size="small">
                        <span>Элементов: {template.elements.length}</span>
                        <span>
                          Обновлено: {new Date(template.updatedAt).toLocaleDateString()}
                        </span>
                      </Space>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <Modal
            title="Создать шаблон"
            visible={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              form.resetFields();
            }}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleCreateTemplate}
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

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                  >
                    Создать
                  </Button>
                  <Button
                    onClick={() => {
                      setIsModalVisible(false);
                      form.resetFields();
                    }}
                  >
                    Отмена
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Card>
    </Layout>
  );
};


export default Template;