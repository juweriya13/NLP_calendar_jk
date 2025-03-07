import nlp from 'compromise';
import { ExtractedEventInfo } from '../types';
import { addDays, addWeeks, parse, startOfToday } from 'date-fns';

const PRIORITY_KEYWORDS = {
  high: ['urgent', 'important', 'critical', 'asap', 'priority', 'high'],
  medium: ['normal', 'regular', 'medium'],
  low: ['low', 'optional', 'whenever', 'flexible']
};

const RECURRING_PATTERNS = {
  daily: ['every day', 'daily', 'each day'],
  weekly: ['every week', 'weekly', 'each week'],
  monthly: ['every month', 'monthly', 'each month'],
  yearly: ['every year', 'yearly', 'annually', 'each year']
};

const CATEGORIES = [
  'work',
  'personal',
  'health',
  'social',
  'family',
  'shopping',
  'travel',
  'education',
  'finance',
  'other'
];

export function extractEventInfo(text: string): ExtractedEventInfo {
  const doc = nlp(text);
  
  // Extract date
  let date: Date | undefined;
  
  // Handle relative dates first
  if (text.toLowerCase().includes('tomorrow')) {
    date = addDays(startOfToday(), 1);
  } else if (text.toLowerCase().includes('today')) {
    date = startOfToday();
  } else if (text.toLowerCase().includes('next week')) {
    date = addWeeks(startOfToday(), 1);
  } else {
    // Try to extract specific dates
    const monthDayPattern = /(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?/i;
    const monthDayMatch = text.match(monthDayPattern);
    
    if (monthDayMatch) {
      const [_, month, day] = monthDayMatch;
      const year = new Date().getFullYear();
      const dateStr = `${month} ${day}, ${year}`;
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate;
      }
    } else {
      // Try to handle "next Tuesday" type patterns
      const weekdayPattern = /next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i;
      const weekdayMatch = text.match(weekdayPattern);
      
      if (weekdayMatch) {
        const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const targetDay = weekdays.indexOf(weekdayMatch[1].toLowerCase());
        const today = new Date();
        const currentDay = today.getDay();
        
        let daysToAdd = targetDay - currentDay;
        if (daysToAdd <= 0) daysToAdd += 7;
        
        date = addDays(today, daysToAdd);
      }
    }
  }
  
  // Extract time
  let time: string | undefined;
  const timePattern = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i;
  const timeMatch = text.match(timePattern);
  
  if (timeMatch) {
    const [_, hours, minutes = '00', meridiem] = timeMatch;
    time = `${hours}:${minutes}${meridiem.toLowerCase()}`;
  }
  
  // Extract location
  const locationPatterns = [
    /(?:at|in)\s+(?:the\s+)?([^,\.]+?)(?=\s+at|\s*$|\s*,|\s+on\s+)/i,
    /(?:at|in)\s+(?:the\s+)?([^,\.]+)(?:\s*$|,)/i
  ];
  
  let location: string | undefined;
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match && !match[1].match(timePattern)) {
      location = match[1].trim();
      break;
    }
  }
  
  // Extract priority
  let priority: 'low' | 'medium' | 'high' | undefined;
  const textLower = text.toLowerCase();
  
  for (const [level, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      priority = level as 'low' | 'medium' | 'high';
      break;
    }
  }

  // Extract recurring pattern
  let recurring: 'daily' | 'weekly' | 'monthly' | 'yearly' | undefined;
  for (const [pattern, keywords] of Object.entries(RECURRING_PATTERNS)) {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      recurring = pattern as 'daily' | 'weekly' | 'monthly' | 'yearly';
      break;
    }
  }

  // Extract category
  let category: string | undefined;
  for (const cat of CATEGORIES) {
    if (textLower.includes(cat)) {
      category = cat;
      break;
    }
  }

  // Extract tags
  const tags = new Set<string>();
  const hashtagPattern = /#(\w+)/g;
  let hashtagMatch;
  
  while ((hashtagMatch = hashtagPattern.exec(text)) !== null) {
    tags.add(hashtagMatch[1]);
  }
  
  // Extract title
  let title: string;
  const eventTypes = ['meeting', 'appointment', 'call', 'lunch', 'dinner', 'conference', 'event', 'reminder', 'task'];
  const eventTypePattern = new RegExp(`(${eventTypes.join('|')})\\s+(?:with|about|for)?\\s+([^,\\.]+)`, 'i');
  const titleMatch = text.match(eventTypePattern);
  
  if (titleMatch) {
    title = titleMatch[0].trim();
  } else {
    // If no specific event type is found, take the first part of the text until a time/location marker
    title = text.split(/\s+(?:at|in|on|tomorrow|next|today)\s+/)[0].trim() || 'Untitled Event';
  }

  return {
    title,
    date,
    time,
    location,
    priority: priority || 'medium',
    tags: Array.from(tags),
    recurring,
    category
  };
}