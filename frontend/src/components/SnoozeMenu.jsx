import { useContext, useState, useRef, useEffect } from 'react';
import { TodoContext } from '../context/TodoContext';
import { formatTimeRemaining } from '../utils/dateUtils';

export default function SnoozeMenu({ task }) {
  const { snoozeTask } = useContext(TodoContext);
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

  const snoozeDurations = [
    { label: '5 min', ms: 5 * 60 * 1000, emoji: '⏰' },
    { label: '15 min', ms: 15 * 60 * 1000, emoji: '🕐' },
    { label: '30 min', ms: 30 * 60 * 1000, emoji: '🕰️' },
    { label: '1 hour', ms: 60 * 60 * 1000, emoji: '⏱️' },
    { label: 'Until tomorrow', ms: 24 * 60 * 60 * 1000, emoji: '🌙' },
  ];

  const handleSnooze = (ms) => {
    snoozeTask(task.id, ms);
    setIsOpen(false);
  };

  // Check if task is already snoozed
  const isSnoozed = task.snoozedUntil && new Date(task.snoozedUntil) > new Date();
  const snoozeTime = isSnoozed ? new Date(task.snoozedUntil) : null;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`button-secondary text-sm transition-all ${
          isSnoozed ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' : ''
        }`}
        title={isSnoozed ? `Snoozed until ${snoozeTime.toLocaleString()}` : 'Snooze task'}
      >
        ⏸️ {isSnoozed ? `Snoozed` : 'Snooze'}
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-xl z-40 min-w-max">
          <div className="p-2 space-y-1">
            {isSnoozed && (
              <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-200">
                Currently snoozed until {snoozeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}

            {snoozeDurations.map(duration => (
              <button
                key={duration.ms}
                onClick={() => handleSnooze(duration.ms)}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm transition-colors flex items-center gap-2"
              >
                <span>{duration.emoji}</span>
                <span>{duration.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
