import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed bottom-5 right-5 z-50 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeToggle;
