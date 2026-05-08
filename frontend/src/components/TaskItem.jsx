import { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import { formatTimeRemaining } from '../utils/dateUtils';
import SnoozeMenu from './SnoozeMenu';

const priorityEmoji = { high: '🔴', medium: '🟡', low: '🟢' };

export default function TaskItem({ task, onEdit }) {
  const { toggleComplete, deleteTask, snoozeTask } = useContext(TodoContext);

  const deadline = task.deadline ? new Date(task.deadline) : null;
  const isOverdue = deadline && deadline < new Date() && !task.completed;
  const isApproaching = deadline && !task.completed && !isOverdue && (deadline - new Date()) < 3600000; // 1 hour

  const snoozedUntil = task.snoozedUntil ? new Date(task.snoozedUntil) : null;
  const isSnoozed = snoozedUntil && snoozedUntil > new Date();

  return (
    <div className={`
      border rounded-lg p-4 transition-all
      ${task.completed
        ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
        : isSnoozed
        ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}
      ${isOverdue ? 'border-red-300 dark:border-red-600' : isApproaching ? 'border-yellow-300 dark:border-yellow-600' : ''}
    `}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleComplete(task.id)}
          className="mt-1 w-5 h-5 rounded cursor-pointer"
        />

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`
              text-base font-medium
              ${task.completed
                ? 'line-through text-gray-500 dark:text-gray-400'
                : 'text-gray-800 dark:text-gray-100'}
            `}>
              {task.title}
            </h3>
            {/* Priority Badge */}
            <span className={`badge-${task.priority}`}>
              {priorityEmoji[task.priority]} {task.priority}
            </span>
          </div>

          {/* Description */}
          {task.description && (
            <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
              {task.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-2 mt-2">
            {task.category && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                📁 {task.category}
              </span>
            )}
            {task.tags.map(tag => (
              <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                🏷️ {tag}
              </span>
            ))}
            {task.deadline && (
              <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                isOverdue ? 'bg-red-100 text-red-700' :
                isApproaching ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                <span>{isOverdue ? '⏰' : '📅'}</span>
                <span className="font-medium">{formatTimeRemaining(task.deadline)}</span>
              </span>
            )}
            {isSnoozed && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                ⏸️ Snoozed until {new Date(task.snoozedUntil).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!task.completed && <SnoozeMenu task={task} />}
          <button
            onClick={() => onEdit(task)}
            className="button-secondary text-sm"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="button-danger text-sm"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
