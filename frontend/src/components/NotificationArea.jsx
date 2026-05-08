import { useContext, useState, useCallback } from 'react';
import { TodoContext } from '../context/TodoContext';
import { useNotificationScheduler } from '../hooks/useNotificationScheduler';
import NotificationToast from './NotificationToast';

export default function NotificationArea() {
  const { state, setNotificationShown } = useContext(TodoContext);
  const [notifications, setNotifications] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? window.Notification.permission : 'default'
  );

  // Request browser notification permission
  const requestNotificationPermission = useCallback(() => {
    if ('Notification' in window && notificationPermission === 'default') {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }
  }, [notificationPermission]);

  // Show browser notification
  const showBrowserNotification = useCallback((notification) => {
    if ('Notification' in window && notificationPermission === 'granted') {
      try {
        new Notification(notification.type === 'overdue' ? '🔴 Task Overdue' : '⏰ Task Approaching', {
          body: notification.task.title,
          icon: notification.type === 'overdue' ? '🔴' : '⏰',
          tag: `task-${notification.task.id}`,
          requireInteraction: notification.type === 'overdue',
        });
      } catch (error) {
        console.error('Failed to show notification:', error);
      }
    }
  }, [notificationPermission]);

  // Handle notifications from scheduler
  const handleNotification = useCallback((notification) => {
    // Show in-app toast
    setNotifications(prev => [...prev, notification]);

    // Show browser notification
    showBrowserNotification(notification);

    // Mark as shown
    setNotificationShown(notification.task.id);
  }, [showBrowserNotification, setNotificationShown]);

  // Use notification scheduler
  useNotificationScheduler(state.tasks, handleNotification);

  const handleDismissNotification = useCallback((index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <>
      {/* Permission Request Banner */}
      {notificationPermission === 'default' && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg z-40 max-w-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm">Enable notifications for deadline reminders?</span>
            <button
              onClick={requestNotificationPermission}
              className="px-3 py-1 bg-white text-blue-500 rounded font-medium text-sm hover:bg-gray-100"
            >
              Allow
            </button>
          </div>
        </div>
      )}

      {/* Notification Toasts */}
      <div className="fixed bottom-6 right-6 space-y-2 z-50 max-w-sm">
        {notifications.map((notification, index) => (
          <NotificationToast
            key={`${notification.task.id}-${index}`}
            notification={notification}
            onDismiss={() => handleDismissNotification(index)}
          />
        ))}
      </div>
    </>
  );
}
