import { useContext, useState, useCallback } from 'react';
import { TodoContext } from '../context/TodoContext';
import SettingsMenu from './SettingsMenu';

export default function Header({ onSearchChange }) {
  const { state, exportAsJSON, importFromJSON, clearAllData } = useContext(TodoContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBackupInfo, setShowBackupInfo] = useState(false);

  // Debounced search
  const handleSearchChange = useCallback((e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearchChange?.(term);
  }, [onSearchChange]);

  const handleExport = () => {
    const json = exportAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (importFromJSON(event.target.result)) {
            alert('Tasks imported successfully!');
          } else {
            alert('Failed to import tasks. Invalid JSON format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const lastBackupDisplay = state.lastBackupTime
    ? new Date(state.lastBackupTime).toLocaleString()
    : 'Never';

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">📋 Todo App</h1>

        <input
          type="text"
          placeholder="🔍 Search by title or description..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="input-base flex-1 max-w-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            title="Export all tasks as JSON"
            className="button-secondary text-sm"
          >
            📥 Export
          </button>
          <button
            onClick={handleImport}
            title="Import tasks from JSON file"
            className="button-secondary text-sm"
          >
            📤 Import
          </button>
          <SettingsMenu />
          <button
            onClick={clearAllData}
            title="Clear all data (cannot be undone)"
            className="button-danger text-sm"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Quick filter pills */}
      <div className="flex gap-2 flex-wrap text-sm">
        <span className="text-gray-600 dark:text-gray-400">Quick filters:</span>
        <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 font-medium text-xs">
          📋 All ({state.tasks.length})
        </button>
        <button className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs">
          📝 Pending ({state.tasks.filter(t => !t.completed).length})
        </button>
        <button className="px-3 py-1 rounded-full bg-green-100 text-green-800 hover:bg-green-200 text-xs">
          ✅ Done ({state.tasks.filter(t => t.completed).length})
        </button>
        <button className="px-3 py-1 rounded-full bg-red-100 text-red-800 hover:bg-red-200 text-xs">
          ⏰ Overdue ({state.tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && !t.completed).length})
        </button>
      </div>
    </header>
  );
}
