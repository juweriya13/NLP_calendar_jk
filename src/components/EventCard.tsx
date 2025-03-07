import React from 'react';
import { motion } from 'framer-motion';
import { Event } from '../types';
import { Check, Clock, MapPin, Tag, Users, Calendar, AlertCircle, X } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  style?: 'minimal' | 'gradient' | 'solid' | 'glass';
}

export function EventCard({ event, onComplete, onDelete, style = 'gradient' }: EventCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200';
      default: return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200';
    }
  };

  const getCardStyle = () => {
    switch (style) {
      case 'minimal':
        return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
      case 'gradient':
        return 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700';
      case 'solid':
        return getPriorityColor(event.priority);
      case 'glass':
        return 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20';
      default:
        return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200
        ${getCardStyle()}
        ${event.completed ? 'opacity-75' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${event.completed ? 'line-through' : ''}`}>
              {event.title}
            </h3>
            {event.recurring && (
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
          </div>
          
          <div className="mt-2 space-y-1">
            {event.time && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 mr-1" />
                {event.time}
                {event.duration && ` (${event.duration} min)`}
              </div>
            )}
            
            {event.location && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="w-4 h-4 mr-1" />
                {event.location}
              </div>
            )}

            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Users className="w-4 h-4 mr-1" />
                {event.attendees.join(', ')}
              </div>
            )}
          </div>

          {event.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {event.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {event.notes && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              {event.notes}
            </div>
          )}
        </div>

        <div className="flex items-start gap-2">
          {onComplete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onComplete(event.id)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Check className={`w-5 h-5 ${event.completed ? 'text-green-500' : 'text-gray-400'}`} />
            </motion.button>
          )}
          
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(event.id)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}