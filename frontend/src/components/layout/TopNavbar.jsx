import React, { useRef } from 'react';
import { Search, Bell, Calendar, Sun, Moon } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import { useTheme } from '../../context/ThemeContext';

export default function TopNavbar() {
  const { theme, toggleTheme } = useTheme();
  const dateInputRef = useRef(null);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleDateClick = () => {
    if (dateInputRef.current) {
      if (dateInputRef.current.showPicker) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-[#141822] border-b border-gray-200 dark:border-[#242A38] px-6 flex items-center justify-between shrink-0 transition-colors duration-200">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search tasks, projects... (Ctrl + K)"
          className="w-full bg-gray-50 dark:bg-[#1C2230] border border-gray-200 dark:border-[#2B3446] rounded-lg pl-9 pr-4 py-1.5 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Real Calendar Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={handleDateClick}
            className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-[#1C2230] hover:bg-gray-200 dark:hover:bg-[#252c3d] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#2B3446] transition cursor-pointer"
          >
            <Calendar size={14} className="text-blue-500" />
            <span>{todayFormatted}</span>
          </button>

          <input
            type="date"
            ref={dateInputRef}
            className="absolute opacity-0 pointer-events-none -bottom-2 left-0 w-0 h-0"
          />
        </div>

        {/* Theme Toggle Button (Sun / Moon) */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-lg bg-gray-100 dark:bg-[#1C2230] border border-gray-200 dark:border-[#2B3446] text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun size={16} className="text-amber-500" />
          ) : (
            <Moon size={16} className="text-blue-600" />
          )}
        </button>

        {/* Notifications Icon */}
        <button 
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-lg bg-gray-100 dark:bg-[#1C2230] border border-gray-200 dark:border-[#2B3446] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          <Bell size={16} />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="ml-2">
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </header>
  );
}