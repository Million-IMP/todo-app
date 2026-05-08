import { useEffect, useCallback, useRef } from 'react';

// Hook for managing deadline notifications and alerts
export function useNotificationScheduler(tasks, onNotification, options = {}) {
  const {
    checkInterval = 60000, // Check every 1 minute
    notificationThreshold = 3600000, // 1 hour before deadline
  } = options;

  const shownNotificationsRef = useRef(new Set()); // Track shown notifications

  const checkDeadlines = useCallback(() => {
    const now = new Date();

    tasks.forEach(task => {
      // Skip if completed or snoozed
      if (task.completed) return;
      if (task.snoozedUntil && new Date(task.snoozedUntil) > now) return;

      // Skip if no deadline
      if (!task.deadline) return;

      const deadline = new Date(task.deadline);
      const timeTillDeadline = deadline - now;
      const notificationKey = `task-${task.id}`;

      // Check if approaching (1 hour before)
      if (
        timeTillDeadline <= notificationThreshold &&
        timeTillDeadline > 0 &&
        !task.notificationShown &&
        !shownNotificationsRef.current.has(`${notificationKey}-approaching`)
      ) {
        const minutesLeft = Math.round(timeTillDeadline / 60000);
        onNotification({
          taskId: task.id,
          type: 'approaching',
          task,
          message: `Due in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}`,
        });
        shownNotificationsRef.current.add(`${notificationKey}-approaching`);
      }

      // Check if overdue
      if (
        timeTillDeadline < 0 &&
        !task.completed &&
        !shownNotificationsRef.current.has(`${notificationKey}-overdue`)
      ) {
        const minutesOverdue = Math.round(Math.abs(timeTillDeadline) / 60000);
        onNotification({
          taskId: task.id,
          type: 'overdue',
          task,
          message: `Overdue by ${minutesOverdue} minute${minutesOverdue !== 1 ? 's' : ''}`,
        });
        shownNotificationsRef.current.add(`${notificationKey}-overdue`);
      }

      // Reset approaching notification if snooze was triggered
      if (task.snoozedUntil && new Date(task.snoozedUntil) > now) {
        shownNotificationsRef.current.delete(`${notificationKey}-approaching`);
      }
    });
  }, [tasks, onNotification, notificationThreshold]);

  // Set up interval to check deadlines
  useEffect(() => {
    // Run check immediately on mount
    checkDeadlines();

    // Set up interval
    const interval = setInterval(() => {
      checkDeadlines();
    }, checkInterval);

    return () => clearInterval(interval);
  }, [checkDeadlines, checkInterval]);

  return { checkDeadlines };
}
