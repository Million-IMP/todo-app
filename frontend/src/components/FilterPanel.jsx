import { useContext, useState } from 'react';
import { TodoContext } from '../context/TodoContext';

export default function FilterPanel({ isOpen, onClose }) {
  const { state, setFilterCategory, setFilterTags, setSortBy } = useContext(TodoContext);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    tags: true,
    sort: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleClearFilters = () => {
    setFilterCategory(null);
    setFilterTags([]);
    setSortBy('deadline');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">🔍 Advanced Filters</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Category Filter */}
          <div>
            <button
              onClick={() => toggleSection('category')}
              className="w-full flex items-center justify-between py-2 px-2 hover:bg-gray-100 rounded"
            >
              <h3 className="font-semibold text-gray-700">Categories</h3>
              <span>{expandedSections.category ? '▼' : '▶'}</span>
            </button>
            {expandedSections.category && (
              <div className="pl-4 space-y-2">
                <label className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={state.filterCategory === null}
                    onChange={() => setFilterCategory(null)}
                  />
                  <span>All Categories</span>
                </label>
                {state.categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={state.filterCategory === cat}
                      onChange={() => setFilterCategory(cat)}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Tag Filter */}
          <div>
            <button
              onClick={() => toggleSection('tags')}
              className="w-full flex items-center justify-between py-2 px-2 hover:bg-gray-100 rounded"
            >
              <h3 className="font-semibold text-gray-700">Tags</h3>
              <span>{expandedSections.tags ? '▼' : '▶'}</span>
            </button>
            {expandedSections.tags && (
              <div className="pl-4 space-y-2">
                {state.tags.length === 0 ? (
                  <p className="text-sm text-gray-500">No tags yet</p>
                ) : (
                  state.tags.map(tag => (
                    <label key={tag} className="flex items-center gap-2 py-1 cursor-pointer">
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
                      <span>{tag}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sort Filter */}
          <div>
            <button
              onClick={() => toggleSection('sort')}
              className="w-full flex items-center justify-between py-2 px-2 hover:bg-gray-100 rounded"
            >
              <h3 className="font-semibold text-gray-700">Sort By</h3>
              <span>{expandedSections.sort ? '▼' : '▶'}</span>
            </button>
            {expandedSections.sort && (
              <div className="pl-4 space-y-2">
                <label className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={state.sortBy === 'deadline'}
                    onChange={() => setSortBy('deadline')}
                  />
                  <span>📅 Deadline</span>
                </label>
                <label className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={state.sortBy === 'priority'}
                    onChange={() => setSortBy('priority')}
                  />
                  <span>🔴 Priority</span>
                </label>
                <label className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    checked={state.sortBy === 'created'}
                    onChange={() => setSortBy('created')}
                  />
                  <span>📝 Created</span>
                </label>
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={handleClearFilters}
            className="w-full button-secondary mt-4"
          >
            🔄 Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
}
