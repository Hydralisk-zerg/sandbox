import React, { useState, useEffect } from 'react';
import { Input, Button, Row, Col, Tag, Tooltip, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { ProjectForm } from './forms/ProjectForm';
import { TaskForm } from './forms/TaskForm';
import { EventForm } from './forms/EventForm';
import { DeleteOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Project, Task, Event } from './types';

type FormType = 'project' | 'task' | 'event' | null;
type ItemType = 'projects' | 'tasks' | 'events';

interface Items {
  projects: Project[];
  tasks: Task[];
  events: Event[];
}
const templateStyles = {
  container: {
    padding: '20px',
    display: 'flex',
    gap: '20px',
    width: '100%',
    boxSizing: 'border-box' as 'border-box'
  },
  card: {
    flex: '1',
    minWidth: '320px',
    border: '1px solid #d9d9d9',
    borderRadius: '8px',
    padding: '15px',
    position: 'relative' as 'relative',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  itemsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  listItem: {
    padding: '10px',
    borderBottom: '1px solid #f0f0f0',
    marginBottom: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  itemTitle: {
    fontWeight: 'bold',
    marginRight: '5px',
    display: 'block'
  },
  itemDescription: {
    fontWeight: 'normal',
    color: '#666',
    display: 'block',
    fontSize: '0.9em',
    marginTop: '4px'
  },
  modal: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  deleteButton: {
    marginLeft: '8px',
    color: '#ff4d4f',
    cursor: 'pointer'
  },
  tags: {
    marginTop: '8px',
    display: 'flex',
    gap: '4px'
  }
};

const Template: React.FC = () => {
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [searchTerms, setSearchTerms] = useState({
    project: '',
    task: '',
    event: ''
  });

  const [items, setItems] = useState<Items>({
    projects: [],
    tasks: [],
    events: []
  });
  

  useEffect(() => {
    const loadedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const loadedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const loadedEvents = JSON.parse(localStorage.getItem('events') || '[]');

    setItems({
      projects: loadedProjects,
      tasks: loadedTasks,
      events: loadedEvents
    });
  }, []);

  const handleFormSubmit = (type: FormType, values: any) => {
    if (!type) return;

    const newId = uuidv4();

    switch (type) {
      case 'project':
        const newProject: Project = {
          id: newId,
          projectName: values.projectName,
          description: values.description,
          tasks: values.tasks || [],
          events: values.events || []
        };

        const updatedTasks = items.tasks.map(task => 
          values.tasks?.includes(task.id) ? { ...task, projectId: newId } : task
        );

        const updatedEvents = items.events.map(event => 
          values.events?.includes(event.id) ? { ...event, projectId: newId } : event
        );

        setItems(prev => ({
          ...prev,
          projects: [...prev.projects, newProject],
          tasks: updatedTasks,
          events: updatedEvents
        }));
        break;

      case 'task':
        const newTask: Task = {
          id: newId,
          taskName: values.taskName,
          description: values.description,
          projectId: values.projectId,
          status: values.status,
          priority: values.priority,
          dueDate: values.dueDate.format('YYYY-MM-DD')
        };

        setItems(prev => ({
          ...prev,
          tasks: [...prev.tasks, newTask]
        }));
        break;

      case 'event':
        const newEvent: Event = {
          id: newId,
          eventName: values.eventName,
          description: values.description,
          projectId: values.projectId,
          date: values.date.format('YYYY-MM-DD'),
          time: values.time.format('HH:mm')
        };

        setItems(prev => ({
          ...prev,
          events: [...prev.events, newEvent]
        }));
        break;
    }

    localStorage.setItem('projects', JSON.stringify(items.projects));
    localStorage.setItem('tasks', JSON.stringify(items.tasks));
    localStorage.setItem('events', JSON.stringify(items.events));

    setActiveForm(null);
  };

  const handleDelete = (type: ItemType, id: string) => {
    setItems(prev => {
      const newItems: Items = {
        projects: [...prev.projects],
        tasks: [...prev.tasks],
        events: [...prev.events]
      };
  
      if (type === 'projects') {
        newItems.projects = prev.projects.filter(item => item.id !== id);
      } else if (type === 'tasks') {
        newItems.tasks = prev.tasks.filter(item => item.id !== id);
      } else if (type === 'events') {
        newItems.events = prev.events.filter(item => item.id !== id);
      }
  
      // Теперь используем типизированный ключ
      (Object.keys(newItems) as ItemType[]).forEach(key => {
        localStorage.setItem(key, JSON.stringify(newItems[key]));
      });
  
      return newItems;
    });
  };
  

  const filterItems = (itemsList: any[], searchTerm: string) => {
    return itemsList.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const renderForm = () => {
    switch (activeForm) {
      case 'project':
        return (
          <ProjectForm
            onClose={() => setActiveForm(null)}
            onSubmit={(values) => handleFormSubmit('project', values)}
            tasks={items.tasks}
            events={items.events}
          />
        );
      case 'task':
        return (
          <TaskForm
            onClose={() => setActiveForm(null)}
            onSubmit={(values) => handleFormSubmit('task', values)}
            projects={items.projects}
          />
        );
      case 'event':
        return (
          <EventForm
            onClose={() => setActiveForm(null)}
            onSubmit={(values) => handleFormSubmit('event', values)}
            projects={items.projects}
          />
        );
      default:
        return null;
    }
  };

  const renderTaskItem = (task: Task) => (
    <li key={task.id} style={templateStyles.listItem}>
      <div>
        <span style={templateStyles.itemTitle}>{task.taskName}</span>
        <span style={templateStyles.itemDescription}>{task.description}</span>
        <div style={templateStyles.tags}>
          <Tag color={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'}>
            {task.priority}
          </Tag>
          <Tag color={task.status === 'done' ? 'green' : task.status === 'in-progress' ? 'blue' : 'default'}>
            {task.status}
          </Tag>
          <Tag icon={<CalendarOutlined />}>{task.dueDate}</Tag>
        </div>
      </div>
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={() => handleDelete('tasks', task.id)}
        style={templateStyles.deleteButton}
      />
    </li>
  );

  const renderEventItem = (event: Event) => (
    <li key={event.id} style={templateStyles.listItem}>
      <div>
        <span style={templateStyles.itemTitle}>{event.eventName}</span>
        <span style={templateStyles.itemDescription}>{event.description}</span>
        <div style={templateStyles.tags}>
          <Tag icon={<CalendarOutlined />}>{event.date}</Tag>
          <Tag icon={<ClockCircleOutlined />}>{event.time}</Tag>
        </div>
      </div>
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={() => handleDelete('events', event.id)}
        style={templateStyles.deleteButton}
      />
    </li>
  );

  return (
    <div style={templateStyles.container}>
      <div style={templateStyles.card}>
        <Row>
          <Col span={16}>
            <Input
              placeholder="Поиск проектов"
              onChange={(e) => setSearchTerms({ ...searchTerms, project: e.target.value })}
            />
          </Col>
          <Col offset={1} span={7}>
            <Button
              type="primary"
              ghost
              onClick={() => setActiveForm('project')}
            >
              + Проект
            </Button>
          </Col>
        </Row>
        <ul style={templateStyles.itemsList}>
          {filterItems(items.projects, searchTerms.project).map((project) => (
            <li key={project.id} style={templateStyles.listItem}>
              <div>
                <span style={templateStyles.itemTitle}>{project.projectName}</span>
                <span style={templateStyles.itemDescription}>{project.description}</span>
              </div>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete('projects', project.id)}
                style={templateStyles.deleteButton}
              />
            </li>
          ))}
        </ul>
      </div>

      <div style={templateStyles.card}>
        <Row>
          <Col span={16}>
            <Input
              placeholder="Поиск задач"
              onChange={(e) => setSearchTerms({ ...searchTerms, task: e.target.value })}
            />
          </Col>
          <Col offset={1} span={7}>
            <Button
              type="primary"
              ghost
              onClick={() => setActiveForm('task')}
            >
              + Задача
            </Button>
          </Col>
        </Row>
        <ul style={templateStyles.itemsList}>
          {filterItems(items.tasks, searchTerms.task).map(renderTaskItem)}
        </ul>
      </div>

      <div style={templateStyles.card}>
        <Row>
          <Col span={16}>
            <Input
              placeholder="Поиск событий"
              onChange={(e) => setSearchTerms({ ...searchTerms, event: e.target.value })}
            />
          </Col>
          <Col offset={1} span={7}>
            <Button
              type="primary"
              ghost
              onClick={() => setActiveForm('event')}
            >
              + Событие
            </Button>
          </Col>
        </Row>
        <ul style={templateStyles.itemsList}>
          {filterItems(items.events, searchTerms.event).map(renderEventItem)}
        </ul>
      </div>

      {activeForm && (
        <div style={templateStyles.modal}>
          {renderForm()}
        </div>
      )}
    </div>
  );
};

export default Template;
