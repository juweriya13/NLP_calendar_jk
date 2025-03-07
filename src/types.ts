export interface Event {
  id: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  description?: string;
  color?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  reminder: number;
  completed?: boolean;
  recurring?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  attendees?: string[];
  notes?: string;
  category?: string;
  duration?: number;
}

export interface ExtractedEventInfo {
  title?: string;
  date?: Date;
  time?: string;
  location?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  recurring?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category?: string;
}

export interface ThemeSettings {
  isDarkMode: boolean;
  primaryColor: string;
  fontFamily: string;
  eventCardStyle: 'minimal' | 'gradient' | 'solid' | 'glass';
  calendarStyle: 'classic' | 'modern' | 'compact';
  animations: boolean;
}

export interface UserSettings {
  theme: ThemeSettings;
  defaultReminderMinutes: number;
  showWeekNumbers: boolean;
  startWeekOn: 'sunday' | 'monday';
  timeFormat: '12h' | '24h';
  defaultEventDuration: number;
  defaultEventColor: string;
  enableNotifications: boolean;
  categories: string[];
  defaultView: 'month' | 'week' | 'day';
  showCompleted: boolean;
  enableRecurringEvents: boolean;
  enableDragAndDrop: boolean;
  enableConfetti: boolean;
}