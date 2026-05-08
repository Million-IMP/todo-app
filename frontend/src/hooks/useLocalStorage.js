import { useState, useEffect } from 'react';

// Custom hook for persistent storage with debouncing
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  // Debounced write to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const valueToStore = typeof storedValue === 'function' ? storedValue() : storedValue;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error writing to localStorage (${key}):`, error);
      }
    }, 1000); // Debounce writes by 1 second

    return () => clearTimeout(timer);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
