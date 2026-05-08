import { useMemo } from 'react';

// Hook for filtering, searching, and sorting tasks
export function useTaskFilter(tasks, filterOptions = {}) {
  const {
    searchTerm = '',
    filterCategory = null,
    filterTags = [],
    filterLabels = [],
    sortBy = 'deadline',
    filterCompleted = null, // null = all, true = completed only, false = pending only
  } = filterOptions;

  return useMemo(() => {
    let filtered = [...tasks];

    // Filter by completion status
    if (filterCompleted !== null) {
      filtered = filtered.filter(task => task.completed === filterCompleted);
    }

    // Filter by search term (title + description)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(task => task.category === filterCategory);
    }

    // Filter by tags (AND logic - must have all selected tags)
    if (filterTags.length > 0) {
      filtered = filtered.filter(task =>
        filterTags.every(tag => task.tags.includes(tag))
      );
    }

    // Filter by labels (AND logic)
    if (filterLabels.length > 0) {
      filtered = filtered.filter(task =>
        filterLabels.every(label => task.labels.includes(label))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'deadline': {
          const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Infinity;
          const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Infinity;
          return aDeadline - bDeadline;
        }

        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }

        case 'created': {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }

        case 'updated': {
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        }

        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, searchTerm, filterCategory, filterTags, filterLabels, sortBy, filterCompleted]);
}
