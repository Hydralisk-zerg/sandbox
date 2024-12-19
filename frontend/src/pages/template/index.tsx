import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import ProjectsColumn from './components/ProjectsColumn';
import TasksColumn from './components/TasksColumn';
import EventsColumn from './components/EventsColumn';
import TemplateColumn from './components/TemplateColumn';
import { projectStorage, taskStorage, eventStorage, templateStorage } from '../../services/templateStorage';
import { Project, Task, Template, Event as CustomEvent } from '../../interfaces/interfase';

const { Content } = Layout;

interface EventData extends Omit<CustomEvent, 'id'> {
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    setProjects(projectStorage.getProjects());
    setTasks(taskStorage.getTasks());
    setEvents(eventStorage.getEvents());
    setTemplates(templateStorage.getTemplates());
  }, []);

  // Обработчики для проектов
  const handleProjectAdd = (projectData: Omit<Project, 'id'>) => {
    const newProject = {
      ...projectData,
      id: uuidv4(),
      status: projectData.status || 'pending',
      linkedItems: {
        tasks: [],
        events: [],
        templates: []
      }
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    projectStorage.saveProjects(updatedProjects);
  };

  const handleProjectDelete = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    projectStorage.saveProjects(updatedProjects);
  };

  const handleProjectEdit = (updatedProject: Project) => {
    const updatedProjects = projects.map(p =>
      p.id === updatedProject.id ? updatedProject : p
    );
    setProjects(updatedProjects);
    projectStorage.saveProjects(updatedProjects);
  };

  // Обработчики для задач
  const handleTaskAdd = (taskData: Omit<Task, 'id'>) => {
    const newTask = {
      ...taskData,
      id: uuidv4(),
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium'
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    taskStorage.saveTasks(updatedTasks);
  };

  const handleTaskDelete = (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    taskStorage.saveTasks(updatedTasks);
  };

  const handleTaskEdit = (updatedTask: Task) => {
    const updatedTasks = tasks.map(t =>
      t.id === updatedTask.id ? updatedTask : t
    );
    setTasks(updatedTasks);
    taskStorage.saveTasks(updatedTasks);
  };

  // Обработчики для событий
  const handleEventAdd = (eventData: EventData) => {
    const newEvent: CustomEvent = {
      ...eventData,
      id: uuidv4(),
      status: eventData.status || 'pending',
      priority: eventData.priority || 'medium'
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    eventStorage.saveEvents(updatedEvents);
  };

  const handleEventDelete = (eventId: string) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
    eventStorage.saveEvents(updatedEvents);
  };

  const handleEventEdit = (updatedEvent: CustomEvent) => {
    const updatedEvents = events.map(e =>
      e.id === updatedEvent.id ? updatedEvent : e
    );
    setEvents(updatedEvents);
    eventStorage.saveEvents(updatedEvents);
  };

  // Обработчики для шаблонов
  const handleTemplateAdd = (templateData: Omit<Template, 'id'>) => {
    const newTemplate = {
      ...templateData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    templateStorage.saveTemplates(updatedTemplates);
  };


  const handleTemplateDelete = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    templateStorage.saveTemplates(updatedTemplates);
  };

  const handleTemplateEdit = (updatedTemplate: Template) => {
    const updatedTemplates = templates.map(t =>
      t.id === updatedTemplate.id ? updatedTemplate : t
    );
    setTemplates(updatedTemplates);
    templateStorage.saveTemplates(updatedTemplates);
  };




  return (
    <Layout>
      <Card>
        <Content style={{ padding: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <ProjectsColumn
                projects={projects}
                tasks={tasks}
                events={events}
                templates={templates}
                onProjectAdd={handleProjectAdd}
                onProjectDelete={handleProjectDelete}
                onProjectEdit={handleProjectEdit}
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <TasksColumn
                tasks={tasks}
                onTaskAdd={handleTaskAdd}
                onTaskDelete={handleTaskDelete}
                onTaskEdit={handleTaskEdit}
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <EventsColumn
                events={events}
                onEventAdd={handleEventAdd}
                onEventDelete={handleEventDelete}
                onEventEdit={handleEventEdit}
              />
            </Col>

            <Col xs={24} sm={12} md={6}>
              <TemplateColumn
                templates={templates}
                loading={false}     // добавляем пропс loading
                error={undefined}   // добавляем пропс error
                onTemplateAdd={handleTemplateAdd}
                onTemplateDelete={handleTemplateDelete}
                onTemplateEdit={handleTemplateEdit}
              />
            </Col>
          </Row>
        </Content>
      </Card>
    </Layout>
  );
};

export default Dashboard;
