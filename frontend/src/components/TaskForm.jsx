import { useContext, useState } from 'react';
import { TodoContext } from '../context/TodoContext';

export default function TaskForm({ onClose, editingTask = null }) {
  const { addTask, updateTask, state, addCategory, addTag, addLabel } = useContext(TodoContext);
  const [formData, setFormData] = useState(
    editingTask || {
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      tags: [],
      labels: [],
      deadline: '',
    }
  );
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }

    onClose?.();
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory);
      setFormData({ ...formData, category: newCategory });
      setNewCategory('');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag);
      setFormData({ ...formData, tags: [...new Set([...formData.tags, newTag])] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleAddLabel = () => {
    if (newLabel.trim()) {
      addLabel(newLabel);
      setFormData({ ...formData, labels: [...new Set([...formData.labels, newLabel])] });
      setNewLabel('');
    }
  };

  const handleRemoveLabel = (label) => {
    setFormData({ ...formData, labels: formData.labels.filter(l => l !== label) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800">
        {editingTask ? '✏️ Edit Task' : '➕ New Task'}
      </h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="What needs to be done?"
          className="input-base w-full"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add details..."
          className="input-base w-full resize-none"
          rows="3"
        />
      </div>

      {/* Priority & Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="input-base w-full"
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input-base w-full"
          >
            <option value="">Select category...</option>
            {state.categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Category */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category"
          className="input-base flex-1 text-sm"
        />
        <button
          type="button"
          onClick={handleAddCategory}
          className="button-secondary text-sm"
        >
          Add
        </button>
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
        <input
          type="datetime-local"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          className="input-base w-full"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map(tag => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-red-600 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tag"
            className="input-base flex-1 text-sm"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="button-secondary text-sm"
          >
            Add
          </button>
        </div>
      </div>

      {/* Labels */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Labels</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.labels.map(label => (
            <span
              key={label}
              className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm flex items-center gap-1"
            >
              {label}
              <button
                type="button"
                onClick={() => handleRemoveLabel(label)}
                className="hover:text-red-600 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Add label"
            className="input-base flex-1 text-sm"
          />
          <button
            type="button"
            onClick={handleAddLabel}
            className="button-secondary text-sm"
          >
            Add
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-2">
        <button type="submit" className="button-primary flex-1">
          {editingTask ? '💾 Update Task' : '✅ Create Task'}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="button-secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
