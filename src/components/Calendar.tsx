import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isWeekend, getWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Event } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarProps {
  currentDate: Date;
  events: Event[];
  onDateChange: (date: Date) => void;
  settings: {
    showWeekNumbers: boolean;
    startWeekOn: 'sunday' | 'monday';
    calendarStyle: string;
  };
}

export function Calendar({ currentDate, events, onDateChange, settings }: CalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
      default: return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <CalendarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <motion.h2 
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
            layout
          >
            {format(currentDate, 'MMMM yyyy')}
          </motion.h2>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-blue-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-blue-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </motion.button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {settings.showWeekNumbers && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 text-center text-gray-400 dark:text-gray-500 font-medium">
            Week
          </div>
        )}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-gray-50 dark:bg-gray-800 p-3 text-center text-gray-600 dark:text-gray-300 font-semibold">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          const dayEvents = events.filter(
            event => format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
          );
          
          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.02 }}
              className={`
                min-h-[120px] p-2 bg-white dark:bg-gray-800 transition-all duration-200
                ${isToday(day) ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-200 dark:ring-blue-700' : ''}
                ${!isSameMonth(day, currentDate) ? 'text-gray-400 bg-gray-50 dark:bg-gray-900 dark:text-gray-500' : ''}
                ${isWeekend(day) ? 'bg-gray-50 dark:bg-gray-900' : ''}
                hover:bg-gray-50 dark:hover:bg-gray-700
                transform hover:scale-[1.02] transition-transform
              `}
            >
              <div className="flex justify-between items-center mb-1">
                <div className={`
                  font-medium px-2 py-1 rounded-full w-7 h-7 flex items-center justify-center
                  ${isToday(day) ? 'bg-blue-600 text-white' : ''}
                `}>
                  {format(day, 'd')}
                </div>
                {settings.showWeekNumbers && index % 7 === 0 && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Week {getWeek(day)}
                  </span>
                )}
              </div>
              <div className="mt-1 space-y-1">
                <AnimatePresence>
                  {dayEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="group relative"
                    >
                      <div className={`
                        text-sm p-2 rounded-lg truncate cursor-pointer transition-all duration-200
                        ${getPriorityColor(event.priority)}
                        shadow-sm hover:shadow-md border
                        backdrop-blur-sm
                      `}>
                        {event.time && <span className="font-medium">{event.time} </span>}
                        {event.title}
                        {event.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {event.tags.map(tag => (
                              <span key={tag} className="text-xs px-1.5 py-0.5 bg-white/50 dark:bg-gray-800/50 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="absolute hidden group-hover:block z-10 w-64 p-4 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
                      >
                        <div className="font-semibold text-gray-800 dark:text-white mb-2">{event.title}</div>
                        <div className="space-y-2">
                          {event.time && (
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <span className="mr-2">🕒</span> {event.time}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <span className="mr-2">📍</span> {event.location}
                            </div>
                          )}
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <span className="mr-2">🎯</span> Priority: {event.priority}
                          </div>
                          {event.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {event.tags.map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}