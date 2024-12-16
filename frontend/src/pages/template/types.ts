// template/types.ts

// Типы элементов шаблона
export enum ElementType {
  EVENT = 'event',
  TASK = 'task',
  CONDITION = 'condition'
}

// Статусы для задач и событий
export enum Status {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}

// Базовый элемент шаблона
export interface BaseElement {
  id: string;
  type: ElementType;
  title: string;
  description?: string;
  responsible?: number; // ID пользователя
  department?: number; // ID отдела
}

// Событие
export interface TemplateEvent extends BaseElement {
  type: ElementType.EVENT;
  triggerCondition?: string;
  expectedDuration?: number; // в часах
}

// Задача
export interface TemplateTask extends BaseElement {
  type: ElementType.TASK;
  deadline?: number; // в часах от начала
  requiredDocuments?: string[];
  containerType?: number; // ID из справочника
  cargoType?: number; // ID из справочника
  deliveryType?: number; // ID из справочника
}

// Связь между элементами
export interface Connection {
  id: string;
  fromId: string;
  toId: string;
  condition?: string;
}

// Шаблон проекта
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string; // description должен быть обязательным полем
  elements: any[];
  connections: any[];
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}