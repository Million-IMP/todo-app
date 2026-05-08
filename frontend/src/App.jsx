import { TodoProvider } from './context/TodoProvider';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import NotificationArea from './components/NotificationArea';

export default function App() {
  return (
    <TodoProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <MainContent />
        </div>
        <NotificationArea />
      </div>
    </TodoProvider>
  );
}
