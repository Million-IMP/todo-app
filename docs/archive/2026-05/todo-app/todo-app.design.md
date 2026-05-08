# Design: TODO App

**Feature:** todo-app  
**Status:** Design  
**Architecture Selected:** Option C — Pragmatic Balance (localStorage + Context API + Auto-backup)  
**Created:** 2026-05-08  
**Last Updated:** 2026-05-08  

---

## Context Anchor

| Aspect | Details |
|--------|---------|
| **WHY** | User wants a personal TODO app for self-use, not a team product. Emphasize simplicity, speed, and personal workflow support. |
| **WHO** | Individual user (self-directed). Primary use case: personal daily task management. |
| **RISK** | Data loss if JSON storage is lost. Browser storage limits. No multi-device sync. |
| **SUCCESS** | Users can create/view/update/delete tasks. Persist across sessions. Categories, tags, priorities, deadlines, alerts, and snooze all functional. |
| **SCOPE** | Web app only (React + Vite). Local JSON storage. Single user. No backend/auth required initially. |

---

## 1. Overview

### 1.1 Architecture Decision Summary
**Selected: Option C — Pragmatic Balance**

- **Frontend:** React 18 + Vite (fast build)
- **State Management:** React Context API (Hooks)
- **Storage:** localStorage (JSON serialization) + Export/Import JSON
- **UI Framework:** TailwindCSS (responsive, utility-first)
- **Notifications:** Browser Notification API (with fallback badge)
- **Task Scheduler:** JavaScript setInterval for deadline checks

### 1.2 Why Option C?
- ✅ Fast to implement (1.5 weeks)
- ✅ Sufficient for personal use (up to 500 tasks)
- ✅ Balanced complexity vs. maintainability
- ✅ Built-in backup/export feature
- ✅ No external services or databases needed
- ⚠️ Performance may degrade with 500+ tasks (acceptable for this scope)

---

## 2. Data Model Schema

### 2.1 Core Data Structures

```typescript
// Task object
interface Task {
  id: string;                    // UUID
  title: string;                 // Max 100 chars
  description: string;           // Max 500 chars
  completed: boolean;            // Completion status
  priority: 'high' | 'medium' | 'low';
  category: string;              // Single category
  tags: string[];                // Multiple tags
  labels: string[];              // Custom labels
  deadline: string | null;       // ISO 8601 datetime
  createdAt: string;             // ISO 8601 datetime
  updatedAt: string;             // ISO 8601 datetime
  snoozedUntil: string | null;   // When snooze expires
  notificationShown: boolean;    // Track if 1h-before notification sent
}

// App state
interface TodoState {
  tasks: Task[];
  categories: string[];
  tags: string[];
  labels: string[];
  filterCategory: string | null;
  filterTags: string[];
  sortBy: 'deadline' | 'priority' | 'created';
  viewMode: 'list' | 'kanban';  // Phase 2
  lastBackupTime: number;        // Timestamp of last auto-backup
}

// Notification payload
interface NotificationEvent {
  taskId: string;
  type: 'approaching' | 'overdue';  // 1 hour before or past deadline
  task: Task;
}
```

### 2.2 localStorage Schema

**Key:** `todo-app-state` (single JSON string)

```json
{
  "tasks": [...],
  "categories": ["Work", "Personal", "Shopping"],
  "tags": ["urgent", "important", "blocked"],
  "labels": ["family", "health"],
  "filterCategory": null,
  "filterTags": [],
  "sortBy": "deadline",
  "viewMode": "list",
  "lastBackupTime": 1715157600000
}
```

**Auto-backup:** Every 5 minutes, save to `todo-app-backup-YYYY-MM-DD.json` in localStorage (rotation: keep last 7 backups)

---

## 3. Component Architecture

### 3.1 Component Tree

```
App (Context Provider)
├── Header
│   ├── AppTitle
│   ├── SearchBar (real-time filter by title/description)
│   └── SettingsMenu
│       ├── ExportJSON
│       ├── ImportJSON
│       └── ClearAllData (with confirmation)
├── Sidebar (Left)
│   ├── CategoryFilter
│   ├── TagFilter
│   └── LabelFilter
├── MainContent
│   ├── TaskForm (Add/Edit)
│   │   ├── TitleInput
│   │   ├── DescriptionInput
│   │   ├── PrioritySelect
│   │   ├── CategorySelect
│   │   ├── TagMultiSelect
│   │   ├── LabelMultiSelect
│   │   ├── DeadlinePicker
│   │   └── SubmitButton
│   ├── TaskList
│   │   └── TaskItem (x N)
│   │       ├── Checkbox (toggle complete)
│   │       ├── TaskDetails
│   │       ├── PriorityBadge
│   │       ├── DeadlineDisplay
│   │       ├── SnoozeButton
│   │       ├── EditButton
│   │       └── DeleteButton
│   ├── SortControls
│   └── TaskStats (e.g., "3 pending, 2 overdue, 1 snoozed")
└── NotificationArea (bottom-right)
    └── NotificationToast (temporary)
        ├── TaskTitle
        ├── Deadline info
        ├── SnoozeOption (5m, 15m, 30m, 1h)
        └── DismissButton
```

### 3.2 Component Responsibilities

| Component | Responsibility |
|-----------|-----------------|
| **App** | Context setup, dark mode toggle, route management |
| **TaskForm** | Input validation, create/update task submission |
| **TaskList** | Render filtered/sorted tasks, handle bulk operations |
| **TaskItem** | Display single task, edit/delete buttons, visual status |
| **NotificationArea** | Display approaching/overdue task alerts |
| **Sidebar** | Filter category/tags/labels, quick stats |
| **Header** | Search, export/import, settings |

---

## 4. State Management (Context API)

### 4.1 TodoContext Structure

```typescript
interface TodoContextType {
  state: TodoState;
  
  // Task operations
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  snoozeTask: (id: string, duration: number) => void; // duration in ms
  
  // Filtering/Sorting
  setFilterCategory: (category: string | null) => void;
  setFilterTags: (tags: string[]) => void;
  setSortBy: (sortBy: 'deadline' | 'priority' | 'created') => void;
  
  // Category/Tag/Label management
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;
  addTag: (name: string) => void;
  deleteTag: (name: string) => void;
  
  // Persistence
  exportAsJSON: () => string;
  importFromJSON: (json: string) => boolean;
  clearAllData: () => void;
  
  // Notifications
  dismissNotification: (taskId: string) => void;
  setNotificationShown: (taskId: string) => void;
}

// Usage in components
const { state, addTask, updateTask, ... } = useContext(TodoContext);
```

### 4.2 Custom Hooks

```typescript
// Hook for auto-saving to localStorage
useLocalStorage(key: string, initialValue: T)
  - Reads from localStorage on mount
  - Syncs updates back to localStorage
  - Triggers backup every 5 minutes

// Hook for notification system
useNotificationScheduler()
  - Runs background checks every minute
  - Triggers browser Notification API when deadline approaches/passes
  - Handles snooze logic

// Hook for search/filter
useTaskFilter()
  - Real-time search by title/description
  - Filter by category, tags, labels
  - Sort by deadline/priority/created date
```

---

## 5. Storage & Persistence Strategy

### 5.1 localStorage Flow

1. **On App Load:**
   - Attempt to read `todo-app-state` from localStorage
   - If not found, initialize with empty state
   - Validate schema (check for required fields)

2. **On Task Change:**
   - Serialize state to JSON
   - Write to `todo-app-state`
   - Debounce writes (batch changes within 1s)

3. **Auto-Backup (Every 5 minutes):**
   - Create JSON snapshot: `todo-app-backup-YYYY-MM-DD.json`
   - Rotate: keep only last 7 backups
   - Show "Last backup: 2 minutes ago" in settings

4. **Quota Warning:**
   - Monitor localStorage usage (try to detect quota)
   - If > 80% used, show warning banner
   - Suggest exporting old completed tasks or clearing data

5. **On Browser Cache Clear:**
   - User loses all data (no cloud sync)
   - Fallback: User can recover from manual JSON exports
   - Future Phase 2: Cloud backup option

### 5.2 JSON Export/Import Format

```json
{
  "exportDate": "2026-05-08T15:30:00Z",
  "appVersion": "1.0.0",
  "tasks": [...],
  "categories": [...],
  "tags": [...],
  "labels": [...]
}
```

---

## 6. Notification System Design

### 6.1 Notification Timeline

**For task with deadline = 2026-05-10 14:00 UTC:**

| Time | Event | Action |
|------|-------|--------|
| 2026-05-10 13:00 | 1 hour before | Browser Notification (if permitted) + Badge |
| 2026-05-10 14:00 | Deadline reached | Notification updates to "Overdue" |
| 2026-05-10 15:00 | 1 hour after | Dismiss old notification, show overdue badge |

### 6.2 Notification Handling

```typescript
// Background check (runs every minute via useNotificationScheduler)
const checkDeadlines = () => {
  state.tasks.forEach(task => {
    if (task.completed || task.snoozedUntil > now) return; // Skip completed/snoozed
    
    const deadline = new Date(task.deadline);
    const timeTillDeadline = deadline - now;
    
    // 1 hour before
    if (timeTillDeadline <= 3600000 && !task.notificationShown) {
      showNotification('Task approaching deadline', task);
      setNotificationShown(task.id);
    }
    
    // Overdue
    if (timeTillDeadline < 0) {
      showNotification('Task is overdue', task, 'overdue');
    }
  });
};

// Browser Notification API
const showNotification = (title, task, type = 'approaching') => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: task.title,
      icon: type === 'overdue' ? '🔴' : '⏰',
      tag: `task-${task.id}` // Replace old notification
    });
  } else {
    // Fallback: Show in-app toast
    showInAppNotification(title, task);
  }
};
```

### 6.3 Snooze Implementation

```typescript
// When user snoozes for 15 minutes:
const snoozeTask = (taskId: string, duration: number) => {
  const task = state.tasks.find(t => t.id === taskId);
  task.snoozedUntil = new Date(now.getTime() + duration).toISOString();
  
  // Also snooze deadline temporarily (for display)
  // When snooze expires, deadline reverts to original
};

// Visual indicator: Snoozed tasks shown with "Snoozed until 3:15 PM" label
```

---

## 7. Test Plan

### 7.1 Unit Tests
- Context reducer functions (add, update, delete)
- localStorage read/write
- Filter/sort logic
- Notification scheduling
- Snooze duration calculation

### 7.2 Integration Tests
- Task creation → persistence → retrieval
- Filter category → display only matching tasks
- Export JSON → Import JSON → Verify data
- Deadline detection → Notification trigger
- Snooze task → Notification delayed

### 7.3 E2E Tests (Playwright)
- User can create, edit, complete, delete task
- User can filter by category and tags
- User receives notification 1 hour before deadline
- User can snooze notification
- User can export and import JSON
- App persists data across page reload

### 7.4 Browser Testing
- Chrome/Firefox/Safari/Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)
- Notification API permission handling

---

## 8. Performance Considerations

### 8.1 Optimization Strategies

| Issue | Solution |
|-------|----------|
| Many re-renders | Memoize TaskItem with React.memo, useCallback for event handlers |
| Large task list | Virtual scrolling (if 200+ tasks) using react-window |
| Frequent serialization | Debounce localStorage writes (batch within 1s) |
| Notification checks | Throttle deadline checks to 1/minute, not every render |
| Large JSON export | Compress completed tasks (optional Phase 2) |

### 8.2 Performance Targets
- ✅ Initial load: < 2s
- ✅ Add task: < 500ms
- ✅ Filter 100 tasks: < 100ms
- ✅ Notification check: runs in background thread (Web Worker, Phase 2)

---

## 9. Browser Compatibility

### 9.1 Required APIs
- ✅ localStorage (ES5, ~2011)
- ✅ Notification API (modern browsers, with fallback)
- ✅ Date/Time APIs (standard)
- ✅ JSON.stringify/parse (standard)

### 9.2 Fallbacks
- No Notification API? → Show in-app toast badges
- No localStorage? → Store in sessionStorage (lost on close)
- No modern CSS? → Base styles work in older browsers

### 9.3 Browser Support
- Chrome 60+
- Firefox 55+
- Safari 13+
- Edge 79+
- Mobile: iOS 13+, Android Chrome 60+

---

## 10. Implementation Guide

### 10.1 Directory Structure

```
src/
├── App.jsx                          // Root component
├── context/
│   ├── TodoContext.jsx              // Context definition
│   └── TodoProvider.jsx             // Context provider wrapper
├── hooks/
│   ├── useLocalStorage.js           // localStorage hook
│   ├── useNotificationScheduler.js  // Notification hook
│   └── useTaskFilter.js             // Filter/search hook
├── components/
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── TaskForm.jsx
│   ├── TaskList.jsx
│   ├── TaskItem.jsx
│   ├── NotificationArea.jsx
│   └── ui/
│       ├── Input.jsx
│       ├── Select.jsx
│       ├── Button.jsx
│       └── Modal.jsx (for confirmations)
├── utils/
│   ├── dateUtils.js                 // Deadline calculations
│   ├── uuid.js                      // ID generation
│   └── validators.js                // Input validation
├── styles/
│   ├── globals.css                  // TailwindCSS imports
│   └── components.css               // Component-specific styles
└── App.css

vite.config.js                       // Vite configuration
tailwind.config.js                   // TailwindCSS setup
package.json
```

### 10.2 Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^4.4.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "vitest": "^0.34.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### 10.3 Implementation Phases

#### Phase 1: Core CRUD + UI (Days 1-3)
- [ ] Task creation form (title, description, priority, category)
- [ ] Task list display with complete/delete
- [ ] localStorage setup + persistence
- [ ] Basic responsive layout (mobile-first)

#### Phase 2: Advanced Features (Days 4-7)
- [ ] Deadline picker + display
- [ ] Notification system (approaching + overdue)
- [ ] Tag/label assignment and filtering
- [ ] Snooze functionality
- [ ] Sort controls (deadline, priority, created)

#### Phase 3: Polish & Export (Days 8-10)
- [ ] Export/Import JSON
- [ ] Dark mode toggle
- [ ] Search/filter UI
- [ ] Accessibility audit (WCAG 2.1 Level A)
- [ ] Performance optimization (memoization, virtual scroll)

#### Phase 4: Testing & QA (Days 11-12)
- [ ] Unit tests (Context, utils)
- [ ] Integration tests (full workflows)
- [ ] E2E tests (Playwright)
- [ ] Browser testing (cross-browser)
- [ ] Mobile responsiveness check

---

## 11. Implementation Guide (continued)

### 11.1 Session Guide

**Recommended Session Plan** (for multi-session implementation):

| Session | Module | Duration | Tasks |
|---------|--------|----------|-------|
| **1** | Core + UI | 4h | TaskForm, TaskList, TaskItem components. localStorage setup. |
| **2** | Context API | 3h | TodoContext definition, hooks (useLocalStorage). Add/update/delete operations. |
| **3** | Filtering & Sorting | 3h | useTaskFilter hook. Filter UI (categories, tags). Sort logic. |
| **4** | Deadlines & Notifications | 4h | Deadline picker. useNotificationScheduler. Browser Notification API. |
| **5** | Snooze & Polish | 3h | Snooze functionality. Export/import. Dark mode. Responsive fixes. |
| **6** | Testing | 3h | Unit + Integration tests. E2E tests. Cross-browser testing. |

**Usage:**
```
/pdca do todo-app --scope session-1     # Implement Core + UI
/pdca do todo-app --scope session-2,3   # Implement Context + Filtering
```

### 11.2 Module Map (for --scope parameter)

```
todo-app {
  session-1: Core UI Components
    - TaskForm
    - TaskList
    - TaskItem
    - localStorage initialization
  
  session-2: Context & State Management
    - TodoContext setup
    - useLocalStorage hook
    - CRUD operations
  
  session-3: Filtering & Sorting
    - useTaskFilter hook
    - Sidebar filter UI
    - Sort controls
  
  session-4: Deadlines & Notifications
    - Deadline picker
    - useNotificationScheduler
    - Notification UI
  
  session-5: Snooze, Export & Polish
    - Snooze logic
    - Export/import JSON
    - Dark mode
    - Responsive refinements
  
  session-6: Testing
    - Unit tests
    - Integration tests
    - E2E tests
}
```

---

## 12. UI/UX Mockups & Layout

### 12.1 Main Layout (Desktop)

```
┌─────────────────────────────────────────────────────┐
│  📋 Todo App        [Search]    ⚙️ Settings    🌙   │ Header
├──────────┬──────────────────────────────────────────┤
│           │                                          │
│ Filters   │  + New Task                              │
│ ────────  │  ──────────────────────────────────────  │ Main
│ Category  │  Title: [input]                          │
│  □ Work   │  Desc:  [input]                          │ Content
│  □ Perso. │  Priority: [▼ High] Category: [▼ Work]  │
│           │  Deadline: [📅 2026-05-10]               │
│ Tags      │  Tags: [urgent] [+]                      │
│  □urgent  │  [Add Task]                              │
│  □import. │  ──────────────────────────────────────  │
│           │  📋 Pending (3)                          │
│ Sort by   │  ✓ Complete (5)                          │
│  [deadline]│  ⏸ Snoozed (1)                          │
│           │                                          │
└──────────┴──────────────────────────────────────────┘

Task Item (in list):
┌──────────────────────────────────────────────────────┐
│ ☐ Buy groceries                    🔴 HIGH 🏷 urgent  │
│   Milk, bread, eggs                📅 2026-05-10     │
│                                    ✏️ 🗑️ [snooze ▼]  │
└──────────────────────────────────────────────────────┘

Notification Toast:
┌────────────────────────────┐
│ ⏰ Task Approaching        │
│ Buy groceries               │
│ Due in 1 hour               │
│ [Snooze ▼] [Dismiss]        │
└────────────────────────────┘
```

### 12.2 Mobile Layout

```
┌──────────────────────────┐
│ 📋 [Search] ⚙️           │ Header
├──────────────────────────┤
│ + New Task               │
├──────────────────────────┤ Filters
│ Filters   [Show ▼]       │ (collapsible)
│ Work, Personal, urgent   │
├──────────────────────────┤
│ 📋 Pending (3)           │
│ ──────────────────────    │
│ ☐ Buy groceries          │ Tasks
│   HIGH 🏷urgent          │
│ ─────────────────────    │
│ ☑ Fix bug                │
│   MEDIUM                 │
│ ─────────────────────    │
│ ⏸ Call mom               │
│   LOW (snoozed)          │
└──────────────────────────┘
```

### 12.3 Color Scheme (Light Mode)

```
- Background: #ffffff (white)
- Text: #1f2937 (dark gray)
- Accent: #3b82f6 (blue)
- Priority High: #ef4444 (red)
- Priority Medium: #f59e0b (amber)
- Priority Low: #10b981 (green)
- Completed: #d1d5db (light gray) + strikethrough
- Snoozed: #6366f1 (indigo) + opacity
```

---

## Design Notes

- **Design Reference:** Option C (localStorage + Context API) selected for balance between simplicity and functionality
- **Success Criteria:** All 8 functional + 4 quality criteria from Plan SC achievable with this architecture
- **Scalability:** Handles up to 500 tasks; beyond that, consider Phase 2 migration to IndexedDB
- **Browser Support:** Modern browsers (ES6+) with graceful fallbacks
- **Testing:** Full test coverage planned in Phase 4

---

## Appendix: Sample Code Snippets

### App.jsx
```jsx
import { TodoProvider } from './context/TodoProvider';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import NotificationArea from './components/NotificationArea';

export default function App() {
  return (
    <TodoProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <MainContent />
        </div>
        <NotificationArea />
      </div>
    </TodoProvider>
  );
}
```

### useLocalStorage.js
```jsx
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    const debounce = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(error);
      }
    }, 1000); // Debounce writes by 1s

    return () => clearTimeout(debounce);
  }, [key, value]);

  return [value, setValue];
}
```

---

## Document Complete

This Design document is ready for implementation phase (`/pdca do todo-app`).
