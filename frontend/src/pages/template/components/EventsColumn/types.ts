// components/EventsColumn/types.ts
import { Event } from '../../types';

export interface EventsColumnProps {
  events: Event[];
  loading?: boolean;
  error?: string;
  onEventAdd: (event: Omit<Event, 'id'>) => void;
  onEventDelete: (eventId: string) => void;
  onEventEdit: (event: Event) => void;
}

