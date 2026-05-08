import { useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Header from './Header';

export default function MainContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <main className="flex-1 overflow-y-auto flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header onSearchChange={setSearchTerm} />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* New Task Button or Form */}
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="button-primary w-full text-lg py-3"
            >
              ➕ New Task
            </button>
          ) : (
            <TaskForm
              onClose={handleCloseForm}
              editingTask={editingTask}
            />
          )}

          {/* Task List */}
          <TaskList onEditTask={handleEditTask} searchTerm={searchTerm} />
        </div>
      </div>
    </main>
  );
}
