// Template.tsx
import React, { useState } from 'react';
import { Input, Button, Row, Col } from 'antd';
import ProjectForm from './forms/ProjectForm';
import TaskForm from './forms/TaskForm';
import EventForm from './forms/EventForm';

type FormType = 'project' | 'task' | 'event' | null;

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
    whiteSpace: 'nowrap' as 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  itemTitle: {
    fontWeight: 'bold',
    marginRight: '5px',
    display: 'inline'
  },
  itemDescription: {
    fontWeight: 'normal',
    color: '#666',
    display: 'inline'
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
  }
};

const Template: React.FC = () => {
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [searchTerms, setSearchTerms] = useState({
    project: '',
    task: '',
    event: ''
  });

  const [items, setItems] = useState({
    projects: JSON.parse(localStorage.getItem('projects') || '[]'),
    tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
    events: JSON.parse(localStorage.getItem('events') || '[]')
  });

  const handleFormSelect = (type: FormType) => {
    setActiveForm(type);
  };

  const handleFormSubmit = (type: FormType, newItem: any) => {
    if (!type) return;

    const storageKey = type === 'project' ? 'projects' :
      type === 'task' ? 'tasks' : 'events';

    const updatedItems = [...items[storageKey], newItem];

    localStorage.setItem(storageKey, JSON.stringify(updatedItems));

    setItems(prev => ({
      ...prev,
      [storageKey]: updatedItems
    }));

    setActiveForm(null);
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
        return <ProjectForm
          onClose={() => setActiveForm(null)}
          onSubmit={(values) => handleFormSubmit('project', values)}
        />;
      case 'task':
        return <TaskForm
          onClose={() => setActiveForm(null)}
          onSubmit={(values) => handleFormSubmit('task', values)}
        />;
      case 'event':
        return <EventForm
          onClose={() => setActiveForm(null)}
          onSubmit={(values) => handleFormSubmit('event', values)}
        />;
      default:
        return null;
    }
  };

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
              onClick={() => handleFormSelect('project')}
            >
              + Проект
            </Button>
          </Col>
        </Row>
        <ul style={templateStyles.itemsList}>
          {filterItems(items.projects, searchTerms.project).map((project, index) => (
            <li key={index} style={templateStyles.listItem}>
              <span style={templateStyles.itemTitle}>{project.projectName}</span>
              <span style={templateStyles.itemDescription}>{project.description}</span>
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
              onClick={() => handleFormSelect('task')}
            >
              + Задача
            </Button>
          </Col>
        </Row>
        <ul style={templateStyles.itemsList}>
          {filterItems(items.tasks, searchTerms.task).map((task, index) => (
            <li key={index} style={templateStyles.listItem}>
              <span style={templateStyles.itemTitle}>{task.taskName}</span>
              <span style={templateStyles.itemDescription}>{task.description}</span>
            </li>
          ))}
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
              onClick={() => handleFormSelect('event')}
            >
              + Событие
            </Button>
          </Col>
        </Row>
        <ul style={templateStyles.itemsList}>
          {filterItems(items.events, searchTerms.event).map((event, index) => (
            <li key={index} style={templateStyles.listItem}>
              <span style={templateStyles.itemTitle}>{event.eventName}</span>
              <span style={templateStyles.itemDescription}>{event.description}</span>
            </li>
          ))}
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
