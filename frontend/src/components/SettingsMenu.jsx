import { useState, useRef, useEffect } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

export default function SettingsMenu() {
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="button-secondary text-sm"
        title="Settings"
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-40">
          <div className="p-3 space-y-3 min-w-max">
            {/* Dark Mode Toggle */}
            <label className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleDarkMode}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">
                {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </span>
            </label>

            {/* Info Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 px-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tasks auto-save to browser storage
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Auto-backup every 5 minutes
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
