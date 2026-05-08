import { useState, useEffect, useCallback } from 'react';
import { TodoContext } from './TodoContext';
import { generateId } from '../utils/uuid';

const STORAGE_KEY = 'todo-app-state';

const initialState = {
  tasks: [],
  categories: [],
  tags: [],
  labels: [],
  filterCategory: null,
  filterTags: [],
  filterLabels: [],
  sortBy: 'deadline',
  viewMode: 'list',
  lastBackupTime: null,
};

export function TodoProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : initialState;
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
      return initialState;
    }
  });

  // Debounced save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save state to localStorage:', error);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [state]);

  // Auto-backup every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const backupKey = `todo-app-backup-${new Date().toISOString().split('T')[0]}`;
        window.localStorage.setItem(backupKey, JSON.stringify(state));
        setState(prev => ({ ...prev, lastBackupTime: Date.now() }));

        // Rotate backups - keep only last 7
        const allKeys = Object.keys(window.localStorage);
        const backupKeys = allKeys
          .filter(k => k.startsWith('todo-app-backup-'))
          .sort()
          .reverse();

        while (backupKeys.length > 7) {
          const oldestKey = backupKeys.pop();
          window.localStorage.removeItem(oldestKey);
        }
      } catch (error) {
        console.error('Failed to create backup:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [state]);

  // Task operations
  const addTask = useCallback((taskData) => {
    const newTask = {
      id: generateId(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      snoozedUntil: null,
      notificationShown: false,
    };

    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));

    return newTask;
  }, []);

  const updateTask = useCallback((id, updates) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  }, []);

  const deleteTask = useCallback((id) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id),
    }));
  }, []);

  const toggleComplete = useCallback((id) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  }, []);

  const snoozeTask = useCallback((id, duration) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === id
          ? { ...task, snoozedUntil: new Date(Date.now() + duration).toISOString(), notificationShown: false }
          : task
      ),
    }));
  }, []);

  // Filter & Sort operations
  const setFilterCategory = useCallback((category) => {
    setState(prev => ({ ...prev, filterCategory: category }));
  }, []);

  const setFilterTags = useCallback((tags) => {
    setState(prev => ({ ...prev, filterTags: tags }));
  }, []);

  const setFilterLabels = useCallback((labels) => {
    setState(prev => ({ ...prev, filterLabels: labels }));
  }, []);

  const setSortBy = useCallback((sortBy) => {
    setState(prev => ({ ...prev, sortBy }));
  }, []);

  // Category/Tag/Label management
  const addCategory = useCallback((name) => {
    setState(prev => ({
      ...prev,
      categories: [...new Set([...prev.categories, name])],
    }));
  }, []);

  const deleteCategory = useCallback((name) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== name),
      filterCategory: prev.filterCategory === name ? null : prev.filterCategory,
    }));
  }, []);

  const addTag = useCallback((name) => {
    setState(prev => ({
      ...prev,
      tags: [...new Set([...prev.tags, name])],
    }));
  }, []);

  const deleteTag = useCallback((name) => {
    setState(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== name),
      filterTags: prev.filterTags.filter(t => t !== name),
    }));
  }, []);

  const addLabel = useCallback((name) => {
    setState(prev => ({
      ...prev,
      labels: [...new Set([...prev.labels, name])],
    }));
  }, []);

  const deleteLabel = useCallback((name) => {
    setState(prev => ({
      ...prev,
      labels: prev.labels.filter(l => l !== name),
    }));
  }, []);

  // Persistence operations
  const exportAsJSON = useCallback(() => {
    const exportData = {
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
      tasks: state.tasks,
      categories: state.categories,
      tags: state.tags,
      labels: state.labels,
    };
    return JSON.stringify(exportData, null, 2);
  }, [state]);

  const importFromJSON = useCallback((json) => {
    try {
      const data = JSON.parse(json);
      if (!data.tasks || !Array.isArray(data.tasks)) {
        throw new Error('Invalid format: missing tasks array');
      }
      setState(prev => ({
        ...prev,
        tasks: data.tasks,
        categories: data.categories || [],
        tags: data.tags || [],
        labels: data.labels || [],
      }));
      return true;
    } catch (error) {
      console.error('Failed to import JSON:', error);
      return false;
    }
  }, []);

  const clearAllData = useCallback(() => {
    if (confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
      setState(initialState);
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Notification operations
  const dismissNotification = useCallback((taskId) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId),
    }));
  }, []);

  const setNotificationShown = useCallback((taskId) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, notificationShown: true } : task
      ),
    }));
  }, []);

  const value = {
    state,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    snoozeTask,
    setFilterCategory,
    setFilterTags,
    setFilterLabels,
    setSortBy,
    addCategory,
    deleteCategory,
    addTag,
    deleteTag,
    addLabel,
    deleteLabel,
    exportAsJSON,
    importFromJSON,
    clearAllData,
    dismissNotification,
    setNotificationShown,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
