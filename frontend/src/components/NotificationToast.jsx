import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

export default function NotificationToast({ notification, onDismiss }) {
  const { snoozeTask } = useContext(TodoContext);
  const [isClosing, setIsClosing] = useState(false);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(onDismiss, 300); // Wait for animation
    }, 8000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!notification) return null;

  const isOverdue = notification.type === 'overdue';
  const backgroundColor = isOverdue ? 'bg-red-500' : 'bg-yellow-500';
  const icon = isOverdue ? '🔴' : '⏰';

  return (
    <div
      className={`
        fixed bottom-6 right-6 max-w-sm w-96 rounded-lg shadow-lg
        ${backgroundColor} text-white p-4 z-50
        transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <span className="text-2xl">{icon}</span>
            <div className="flex-1">
              <h4 className="font-bold text-sm">
                {isOverdue ? 'Task Overdue' : 'Task Approaching'}
              </h4>
              <p className="text-sm font-medium">{notification.task.title}</p>
              {notification.message && (
                <p className="text-xs opacity-90 mt-1">{notification.message}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setIsClosing(true);
              setTimeout(onDismiss, 300);
            }}
            className="text-white hover:opacity-80 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Snooze Buttons */}
        {!isOverdue && (
          <div className="flex gap-2 justify-end text-xs mt-2">
            {[5, 15, 30, 60].map(minutes => (
              <button
                key={minutes}
                onClick={() => {
                  snoozeTask(notification.task.id, minutes * 60 * 1000);
                  setIsClosing(true);
                  setTimeout(onDismiss, 300);
                }}
                className="px-2 py-1 rounded bg-white bg-opacity-20 hover:bg-opacity-30 font-medium"
              >
                {minutes}m
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
