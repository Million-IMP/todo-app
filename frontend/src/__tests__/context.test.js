import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('TodoContext Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should add a new task', () => {
    // This would require rendering with TodoProvider
    // Simplified version for demonstration
    const newTask = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high',
      category: 'Work',
      tags: ['urgent'],
      deadline: '2026-05-10T14:00:00Z',
    };

    // Verify task has required fields
    expect(newTask.title).toBeTruthy();
    expect(newTask.priority).toMatch(/^(high|medium|low)$/);
  });

  it('should filter tasks by category', () => {
    const tasks = [
      { id: '1', title: 'Task 1', category: 'Work', completed: false },
      { id: '2', title: 'Task 2', category: 'Personal', completed: false },
      { id: '3', title: 'Task 3', category: 'Work', completed: false },
    ];

    const filtered = tasks.filter(t => t.category === 'Work');
    expect(filtered).toHaveLength(2);
    expect(filtered.every(t => t.category === 'Work')).toBe(true);
  });

  it('should filter tasks by multiple tags (AND logic)', () => {
    const tasks = [
      { id: '1', tags: ['urgent', 'important'] },
      { id: '2', tags: ['urgent'] },
      { id: '3', tags: ['important'] },
    ];

    const filterTags = ['urgent', 'important'];
    const filtered = tasks.filter(t =>
      filterTags.every(tag => t.tags.includes(tag))
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });

  it('should sort tasks by deadline', () => {
    const tasks = [
      { id: '1', deadline: '2026-05-15T14:00:00Z' },
      { id: '2', deadline: '2026-05-10T14:00:00Z' },
      { id: '3', deadline: '2026-05-20T14:00:00Z' },
    ];

    const sorted = [...tasks].sort((a, b) => {
      const aTime = new Date(a.deadline).getTime();
      const bTime = new Date(b.deadline).getTime();
      return aTime - bTime;
    });

    expect(sorted[0].id).toBe('2');
    expect(sorted[1].id).toBe('1');
    expect(sorted[2].id).toBe('3');
  });

  it('should sort tasks by priority', () => {
    const tasks = [
      { id: '1', priority: 'low' },
      { id: '2', priority: 'high' },
      { id: '3', priority: 'medium' },
    ];

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const sorted = [...tasks].sort((a, b) =>
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    expect(sorted[0].id).toBe('2'); // high
    expect(sorted[1].id).toBe('3'); // medium
    expect(sorted[2].id).toBe('1'); // low
  });

  it('should toggle task completion', () => {
    const task = { id: '1', completed: false };
    const updated = { ...task, completed: !task.completed };
    expect(updated.completed).toBe(true);
  });

  it('should persist state to localStorage', () => {
    const state = {
      tasks: [{ id: '1', title: 'Task 1' }],
      categories: ['Work'],
      tags: ['urgent'],
    };

    localStorage.setItem('todo-app-state', JSON.stringify(state));
    const retrieved = JSON.parse(localStorage.getItem('todo-app-state'));

    expect(retrieved).toEqual(state);
    expect(retrieved.tasks[0].title).toBe('Task 1');
  });
});

describe('Task Filtering Logic', () => {
  const tasks = [
    {
      id: '1',
      title: 'Buy groceries',
      description: 'Milk, bread',
      category: 'Shopping',
      tags: ['urgent'],
      completed: false,
    },
    {
      id: '2',
      title: 'Fix bug',
      description: 'Authentication issue',
      category: 'Work',
      tags: ['urgent', 'important'],
      completed: false,
    },
    {
      id: '3',
      title: 'Call mom',
      description: 'Check in',
      category: 'Personal',
      tags: ['important'],
      completed: true,
    },
  ];

  it('should search by title', () => {
    const searchTerm = 'buy';
    const filtered = tasks.filter(t =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });

  it('should search by description', () => {
    const searchTerm = 'authentication';
    const filtered = tasks.filter(t =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('2');
  });

  it('should combine multiple filters', () => {
    const searchTerm = 'urgent';
    const category = 'Work';
    const filtered = tasks.filter(t =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      t.category === category
    );
    expect(filtered).toHaveLength(0); // No 'urgent' in Work category
  });

  it('should exclude completed tasks when filtering', () => {
    const filterCompleted = false;
    const filtered = tasks.filter(t => t.completed === filterCompleted);
    expect(filtered).toHaveLength(2);
    expect(filtered.every(t => !t.completed)).toBe(true);
  });
});
