import { useContext, useState } from 'react';
import { TodoContext } from '../context/TodoContext';
import FilterPanel from './FilterPanel';

export default function Sidebar() {
  const { state, setFilterCategory, setFilterTags, setFilterLabels, setSortBy } = useContext(TodoContext);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const stats = {
    total: state.tasks.length,
    completed: state.tasks.filter(t => t.completed).length,
    pending: state.tasks.filter(t => !t.completed && !t.snoozedUntil).length,
    snoozed: state.tasks.filter(t => t.snoozedUntil && new Date(t.snoozedUntil) > new Date()).length,
  };

  const activeFiltersCount = (state.filterCategory ? 1 : 0) + state.filterTags.length;

  return (
    <>
      <aside className="w-48 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm space-y-1 text-gray-800 dark:text-gray-200">
            <div>📊 <strong>{stats.total}</strong> total</div>
            <div>📋 <strong>{stats.pending}</strong> pending</div>
            <div>✅ <strong>{stats.completed}</strong> completed</div>
            <div>⏸️ <strong>{stats.snoozed}</strong> snoozed</div>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-sm">Categories</h3>
            <button
              onClick={() => setFilterCategory(null)}
              className={`block w-full text-left px-2 py-1 rounded text-sm ${
                state.filterCategory === null ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {state.categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`block w-full text-left px-2 py-1 rounded text-sm ${
                  state.filterCategory === cat ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tag Filter */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 text-sm">Tags</h3>
            {state.tags.length === 0 ? (
              <p className="text-xs text-gray-500">No tags yet</p>
            ) : (
              state.tags.map(tag => (
                <label key={tag} className="flex items-center gap-2 px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded">
                  <input
                    type="checkbox"
                    checked={state.filterTags.includes(tag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterTags([...state.filterTags, tag]);
                      } else {
                        setFilterTags(state.filterTags.filter(t => t !== tag));
                      }
                    }}
                  />
                  {tag}
                </label>
              ))
            )}
          </div>

          {/* Label Filter */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 text-sm">Labels</h3>
            {state.labels.length === 0 ? (
              <p className="text-xs text-gray-500">No labels yet</p>
            ) : (
              state.labels.map(label => (
                <label key={label} className="flex items-center gap-2 px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded">
                  <input
                    type="checkbox"
                    checked={state.filterLabels.includes(label)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterLabels([...state.filterLabels, label]);
                      } else {
                        setFilterLabels(state.filterLabels.filter(l => l !== label));
                      }
                    }}
                  />
                  {label}
                </label>
              ))
            )}
          </div>

          {/* Sort */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 text-sm">Sort By</h3>
            <select
              value={state.sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full input-base text-sm"
            >
              <option value="deadline">📅 Deadline</option>
              <option value="priority">🔴 Priority</option>
              <option value="created">📝 Created</option>
            </select>
          </div>

          {/* Advanced Filter Button */}
          <button
            onClick={() => setShowFilterPanel(true)}
            className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-all ${
              activeFiltersCount > 0
                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔍 Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>
        </div>
      </aside>

    <FilterPanel
      isOpen={showFilterPanel}
      onClose={() => setShowFilterPanel(false)}
    />
    </>
  );
}
