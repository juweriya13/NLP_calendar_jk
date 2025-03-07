import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, X, Settings } from 'lucide-react';
import { Calendar } from './components/Calendar';
import { SettingsPanel } from './components/SettingsPanel';
import { extractEventInfo } from './utils/nlp';
import { Event, UserSettings } from './types';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [input, setInput] = useState('');
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    theme: {
      isDarkMode: false,
      primaryColor: '#3b82f6',
      fontFamily: 'system-ui',
      eventCardStyle: 'gradient',
      calendarStyle: 'modern',
      animations: true
    },
    defaultReminderMinutes: 15,
    showWeekNumbers: true,
    startWeekOn: 'monday',
    timeFormat: '12h',
    defaultEventDuration: 60,
    defaultEventColor: '#3b82f6',
    enableNotifications: true
  });

  const handleEventAdd = () => {
    if (!input.trim()) return;

    const extractedInfo = extractEventInfo(input);
    
    if (extractedInfo.date) {
      const newEvent: Event = {
        id: Math.random().toString(36).substr(2, 9),
        title: extractedInfo.title || 'Untitled Event',
        date: extractedInfo.date,
        time: extractedInfo.time,
        location: extractedInfo.location,
        priority: extractedInfo.priority || 'medium',
        tags: extractedInfo.tags || [],
        reminder: settings.defaultReminderMinutes,
        color: settings.defaultEventColor
      };

      setEvents([...events, newEvent]);
      setInput('');
      setIsInputOpen(false);

      if (settings.enableNotifications) {
        // Request notification permission if not granted
        if (Notification.permission !== 'granted') {
          Notification.requestPermission();
        }
      }
    } else {
      alert('Could not detect a date in your input. Please try again with a clearer date mention.\n\nTry phrases like:\n- "tomorrow"\n- "next Tuesday"\n- "March 15th"');
    }
  };

  // Apply theme settings to document
  React.useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', settings.theme.primaryColor);
    document.documentElement.style.fontFamily = settings.theme.fontFamily;
    if (settings.theme.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <CalendarIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Smart Calendar
              </h1>
            </motion.div>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSettingsOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsInputOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Event
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence>
          {isInputOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Event</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsInputOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your event details (e.g., 'Meeting with John tomorrow at 3pm in Conference Room')"
                  className="flex-1 p-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEventAdd();
                    }
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEventAdd}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg"
                >
                  Add
                </motion.button>
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg border border-blue-100 dark:border-gray-600">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">Example phrases you can try:</p>
                <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <li>• "Urgent meeting with Sarah tomorrow at noon #work"</li>
                  <li>• "Low priority team lunch next Tuesday at 2pm in Cafe"</li>
                  <li>• "Important doctor appointment on March 15th at 3:30pm #health"</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Calendar
          currentDate={currentDate}
          events={events}
          onDateChange={setCurrentDate}
          settings={settings}
        />

        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSettingsChange={setSettings}
        />
      </main>
    </div>
  );
}

export default App;