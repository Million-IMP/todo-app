import { useContext, useMemo } from 'react';
import { TodoContext } from '../context/TodoContext';
import TaskItem from './TaskItem';
import { useTaskFilter } from '../hooks/useTaskFilter';

export default function TaskList({ onEditTask, searchTerm = '' }) {
  const { state } = useContext(TodoContext);

  // Use the custom filter hook for comprehensive filtering
  const filteredAndSortedTasks = useTaskFilter(state.tasks, {
    searchTerm: searchTerm,
    filterCategory: state.filterCategory,
    filterTags: state.filterTags,
    filterLabels: state.filterLabels,
    sortBy: state.sortBy,
  });

  const pendingTasks = filteredAndSortedTasks.filter(t => !t.completed);
  const completedTasks = filteredAndSortedTasks.filter(t => t.completed);

  return (
    <div className="space-y-4">
      {pendingTasks.length === 0 && completedTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">📭 No tasks yet</p>
          <p className="text-gray-400 text-sm">Add a new task to get started!</p>
        </div>
      ) : (
        <>
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                📋 Pending ({pendingTasks.length})
              </h3>
              <div className="space-y-2">
                {pendingTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                ✅ Completed ({completedTasks.length})
              </h3>
              <div className="space-y-2">
                {completedTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
