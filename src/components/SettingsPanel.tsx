import React from 'react';
import { X, Moon, Sun, Bell, Palette, Layout, Clock } from 'lucide-react';
import { ThemeSettings, UserSettings } from '../types';
import { HexColorPicker } from 'react-colorful';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
}

const FONT_OPTIONS = [
  { label: 'System Default', value: 'system-ui' },
  { label: 'Inter', value: 'Inter' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Poppins', value: 'Poppins' }
];

const CALENDAR_STYLE_OPTIONS = [
  { label: 'Classic', value: 'classic' },
  { label: 'Modern', value: 'modern' },
  { label: 'Compact', value: 'compact' }
];

const EVENT_STYLE_OPTIONS = [
  { label: 'Minimal', value: 'minimal' },
  { label: 'Gradient', value: 'gradient' },
  { label: 'Solid', value: 'solid' },
  { label: 'Glass', value: 'glass' }
];

const REMINDER_OPTIONS = [
  { label: '5 minutes', value: 5 },
  { label: '10 minutes', value: 10 },
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 }
];

export function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }: SettingsPanelProps) {
  if (!isOpen) return null;

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    onSettingsChange({
      ...settings,
      theme: { ...settings.theme, ...updates }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 m-4 overflow-y-auto max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Palette className="w-6 h-6 mr-2" />
                Settings
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-6">
              {/* Theme Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <Layout className="w-5 h-5 mr-2" />
                  Appearance
                </h3>
                
                <div className="space-y-4">
                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateTheme({ isDarkMode: !settings.theme.isDarkMode })}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {settings.theme.isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </motion.button>
                  </div>

                  {/* Color Picker */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Primary Color</label>
                    <HexColorPicker
                      color={settings.theme.primaryColor}
                      onChange={(color) => updateTheme({ primaryColor: color })}
                      className="w-full"
                    />
                  </div>

                  {/* Calendar Style */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Calendar Style</label>
                    <select
                      value={settings.theme.calendarStyle}
                      onChange={(e) => updateTheme({ calendarStyle: e.target.value as any })}
                      className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    >
                      {CALENDAR_STYLE_OPTIONS.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Font Family */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Font Family</label>
                    <select
                      value={settings.theme.fontFamily}
                      onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                      className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    >
                      {FONT_OPTIONS.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Event Card Style */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Event Card Style</label>
                    <select
                      value={settings.theme.eventCardStyle}
                      onChange={(e) => updateTheme({ eventCardStyle: e.target.value as any })}
                      className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    >
                      {EVENT_STYLE_OPTIONS.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Animations Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Enable Animations</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.theme.animations}
                        onChange={(e) => updateTheme({ animations: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Time & Date Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Time & Date
                </h3>
                
                <div className="space-y-4">
                  {/* Time Format */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Time Format</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSettingsChange({ ...settings, timeFormat: '12h' })}
                        className={`px-3 py-1 rounded ${
                          settings.timeFormat === '12h'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        12h
                      </button>
                      <button
                        onClick={() => onSettingsChange({ ...settings, timeFormat: '24h' })}
                        className={`px-3 py-1 rounded ${
                          settings.timeFormat === '24h'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        24h
                      </button>
                    </div>
                  </div>

                  {/* Week Start */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Start Week On</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSettingsChange({ ...settings, startWeekOn: 'sunday' })}
                        className={`px-3 py-1 rounded ${
                          settings.startWeekOn === 'sunday'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        Sunday
                      </button>
                      <button
                        onClick={() => onSettingsChange({ ...settings, startWeekOn: 'monday' })}
                        className={`px-3 py-1 rounded ${
                          settings.startWeekOn === 'monday'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        Monday
                      </button>
                    </div>
                  </div>

                  {/* Show Week Numbers */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Show Week Numbers</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showWeekNumbers}
                        onChange={(e) => onSettingsChange({ ...settings, showWeekNumbers: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Notifications Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                </h3>
                
                <div className="space-y-4">
                  {/* Enable Notifications */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Enable Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableNotifications}
                        onChange={(e) => onSettingsChange({ ...settings, enableNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Default Reminder Time */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Default Reminder Time</label>
                    <select
                      value={settings.defaultReminderMinutes}
                      onChange={(e) => onSettingsChange({
                        ...settings,
                        defaultReminderMinutes: Number(e.target.value)
                      })}
                      className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    >
                      {REMINDER_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} before
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}