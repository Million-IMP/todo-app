# Plan: TODO App

**Feature:** todo-app  
**Status:** Plan  
**Created:** 2026-05-08  
**Last Updated:** 2026-05-08  

---

## Executive Summary

| Perspective | Description |
|-------------|-------------|
| **Problem** | Users need a lightweight, personal task management tool that helps organize daily work with priorities, deadlines, and smart reminders without complexity. |
| **Solution** | A React + Vite web app with core TODO functionality (create/read/update/delete), supplemented by categorization, labeling, priority levels, deadlines, alerts, and snooze features. Data persists locally as JSON. |
| **Function UX Effect** | Users can quickly add tasks, organize by category/tags, set priorities and deadlines, receive reminders, and snooze notifications. Intuitive interface supports rapid task entry and status updates. |
| **Core Value** | Reduces task management friction, improves prioritization visibility, and prevents deadline misses through timely alerts and flexible snoozing. |

---

## Context Anchor

| Aspect | Details |
|--------|---------|
| **WHY** | User wants a personal TODO app for self-use, not a team product. Emphasize simplicity, speed, and personal workflow support. |
| **WHO** | Individual user (self-directed). Primary use case: personal daily task management. |
| **RISK** | Data loss if JSON storage is lost or corrupted. Browser storage limits (localStorage/IndexedDB). No multi-device sync. |
| **SUCCESS** | Users can create, view, update, and delete tasks. Tasks persist across browser sessions. Categories, tags, priorities, deadlines, and snooze all functional. |
| **SCOPE** | Web application only (React + Vite). JSON-based local storage. Single user. No backend/auth required initially. |

---

## 1. Overview

### 1.1 Feature Title
TODO App — Personal Task Management System

### 1.2 Feature Type
Fullstack web application (frontend-focused, local data storage)

### 1.3 Project Level
**Dynamic** (fullstack, interactive, persistent data)

### 1.4 Primary User Story
> As a user, I want to manage my daily tasks with priorities, categories, and reminders so that I can organize my work and never miss a deadline.

---

## 2. Requirements

### 2.1 Functional Requirements

#### Core Task Management (Must Have)
- **FR-1.1:** Users can create a new TODO with title and description
- **FR-1.2:** Users can view all TODOs in a list
- **FR-1.3:** Users can mark a TODO as complete/incomplete
- **FR-1.4:** Users can delete a TODO
- **FR-1.5:** Users can edit task title and description

#### Categorization & Tagging (Must Have)
- **FR-2.1:** Users can assign a category to a TODO (e.g., "Work", "Personal", "Shopping")
- **FR-2.2:** Users can assign multiple tags to a TODO for fine-grained filtering
- **FR-2.3:** Users can filter TODOs by category and tags
- **FR-2.4:** Users can create new categories and tags as needed

#### Priority & Deadline Management (Must Have)
- **FR-3.1:** Users can set priority level (High, Medium, Low)
- **FR-3.2:** Users can set a deadline (due date and optional time)
- **FR-3.3:** Users can view tasks sorted by deadline (nearest first)
- **FR-3.4:** Users can view tasks sorted by priority

#### Alerts & Reminders (Must Have)
- **FR-4.1:** System notifies user when a deadline is approaching (e.g., 1 hour before)
- **FR-4.2:** System notifies user when a deadline is overdue
- **FR-4.3:** Notifications are browser-based (local notifications, not server push)

#### Snooze Feature (Must Have)
- **FR-5.1:** Users can snooze a notification for 5, 15, 30 minutes, or 1 hour
- **FR-5.2:** Users can snooze a TODO task (move deadline forward by user-specified duration)
- **FR-5.3:** Snoozed TODOs are visually distinct from active TODOs

#### Labels (Must Have)
- **FR-6.1:** Users can assign labels (custom keywords) to tasks for additional metadata
- **FR-6.2:** Users can filter by labels
- **FR-6.3:** Labels are distinct from categories (one-to-many, flexible)

### 2.2 Non-Functional Requirements

#### Data Persistence
- **NFR-1.1:** Data is stored locally as JSON (localStorage or file-based JSON if applicable)
- **NFR-1.2:** No server-side database required
- **NFR-1.3:** Data persists across browser sessions
- **NFR-1.4:** Users can optionally export/import JSON for backup

#### UI/UX
- **NFR-2.1:** Responsive design (mobile-friendly)
- **NFR-2.2:** Fast task entry (< 1 second to add a task)
- **NFR-2.3:** Clear visual distinction between completed and active tasks
- **NFR-2.4:** Intuitive navigation (no learning curve)

#### Performance
- **NFR-3.1:** Page load time < 2 seconds
- **NFR-3.2:** Smooth animations and transitions
- **NFR-3.3:** Handles 500+ tasks without noticeable slowdown

#### Browser Compatibility
- **NFR-4.1:** Support modern browsers (Chrome, Firefox, Safari, Edge)
- **NFR-4.2:** Use localStorage or IndexedDB for persistence

---

## 3. Scope & Constraints

### 3.1 In Scope
- Core CRUD operations for TODOs
- Categories, tags, labels, and priority management
- Deadline and alert system
- Snooze functionality
- Local JSON storage
- Responsive web UI
- Export/import functionality (optional Phase 2)

### 3.2 Out of Scope (Phase 2+)
- Multi-device sync or cloud backup
- Team/collaborative features
- Mobile app (native iOS/Android)
- Advanced analytics or reporting
- Integrations with calendar or email
- Recurring tasks (automation)

### 3.3 Technical Constraints
- **No backend required initially** — all data stored locally
- **No authentication** — single user (local machine)
- **Browser limitations** — localStorage max ~5-10MB per domain
- **Offline-first design** — should work without internet

### 3.4 Timeline Constraints
- Estimated development time: 2-3 weeks (fullstack)
- MVP (minimum viable product): Core CRUD + Categories + Deadlines + Basic Alerts
- Phase 2: Snooze, Labels, Export/Import refinements

---

## 4. Success Criteria

### 4.1 Functional Success Criteria
- [ ] **SC-1:** Users can create, edit, and delete tasks within 5 clicks max
- [ ] **SC-2:** Categories and tags filter correctly, showing only matching tasks
- [ ] **SC-3:** Deadlines trigger browser notifications at correct times (1 hour before, overdue)
- [ ] **SC-4:** Snooze feature delays notifications by selected duration (5m, 15m, 30m, 1h)
- [ ] **SC-5:** Tasks with High priority are visually prominent (color, icon)
- [ ] **SC-6:** Completed tasks are visually distinct (strikethrough, opacity) and can be toggled back to active
- [ ] **SC-7:** Labels display alongside tasks and enable filtering
- [ ] **SC-8:** JSON data persists across browser refreshes and reopens

### 4.2 Quality Success Criteria
- [ ] **SC-9:** All UI elements are responsive on mobile (320px viewport)
- [ ] **SC-10:** No console errors or warnings in production build
- [ ] **SC-11:** Accessibility basics met (WCAG 2.1 Level A: alt text, keyboard navigation, color contrast)
- [ ] **SC-12:** Code is documented with inline comments for non-obvious logic

### 4.3 User Experience Success Criteria
- [ ] **SC-13:** Users can add a task in < 10 seconds (no modal bloat)
- [ ] **SC-14:** Task list is searchable (real-time filter by title/description)
- [ ] **SC-15:** Notification UI is non-intrusive (browser native or subtle modal, not blocking)
- [ ] **SC-16:** Dark mode support (optional, but recommended for evening use)

---

## 5. Assumptions & Dependencies

### 5.1 Assumptions
- User has a modern browser with localStorage/IndexedDB support
- User is comfortable with JSON format for data export/import
- Single-user workflow (no sharing or permissions)
- Notifications require browser permission (handled at runtime)

### 5.2 Dependencies
- **React 18+:** Frontend framework
- **Vite:** Build tool
- **npm/yarn:** Package manager
- **Browser APIs:** localStorage, Notification API, setTimeout
- Optional: A CSS framework (TailwindCSS) for styling

---

## 6. Risks & Mitigations

| Risk | Severity | Impact | Mitigation |
|------|----------|--------|-----------|
| Data loss due to browser cache clear | High | All tasks lost | Implement export to JSON file + remind user to backup |
| localStorage quota exceeded (5-10MB) | Medium | App stops accepting new tasks | Warn user when nearing limit; implement cleanup of old tasks |
| Notification API not supported in older browsers | Low | Alerts won't work | Provide fallback (in-app badge/visual indicator) |
| Complex state management (many tasks) | Medium | Performance degradation | Use React Context or Zustand for efficient state updates |
| Clock skew (system time changed) | Low | Deadline times become inaccurate | Show user system time, allow manual clock adjustment in app |

---

## 7. Open Questions & Decisions

### 7.1 Open Questions
1. **Export/Import:** Should users be able to export tasks as CSV as well as JSON? (Deferred to Phase 2)
2. **Recurring Tasks:** Do we need support for repeating tasks (e.g., "every Monday")? (Out of scope, Phase 2)
3. **Dark Mode:** Is dark mode a must-have or nice-to-have? (Recommend: Phase 1.5)
4. **Search:** Should search be real-time as-you-type or button-triggered? (Recommend: Real-time)

### 7.2 Decisions
- **Decision D-1:** Single-user, local-only to start. Multi-device sync and auth can be added in Phase 2.
- **Decision D-2:** Use localStorage + JSON for simplicity. Consider IndexedDB migration if data grows beyond 5MB.
- **Decision D-3:** Browser native Notification API (with graceful fallback to in-app alerts).
- **Decision D-4:** React Hooks + Context API for state management (avoid Redux overhead for MVP).

---

## 8. Next Steps

### 8.1 Immediate (This Session)
1. ✅ Confirm Plan document with stakeholder (you)
2. Create Design document (`/pdca design todo-app`) with:
   - 3 architecture options (local storage variants)
   - UI/UX mockups
   - Data model schema
   - API/Component breakdown
3. Identify any ambiguities and clarify before moving to Design phase

### 8.2 Post-Design
1. Start implementation (`/pdca do todo-app`)
2. Create React components for core features
3. Set up localStorage persistence
4. Implement notification system
5. Build responsive UI

### 8.3 Testing & QA
1. Run Gap analysis (`/pdca analyze todo-app`)
2. Test on multiple browsers
3. Verify data persistence
4. Test notification timing

---

## Appendix: Data Model (Preliminary)

```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Buy groceries",
      "description": "Milk, bread, eggs",
      "completed": false,
      "priority": "high",
      "category": "shopping",
      "tags": ["urgent", "groceries"],
      "labels": ["personal"],
      "deadline": "2026-05-10T18:00:00Z",
      "createdAt": "2026-05-08T10:00:00Z",
      "snoozedUntil": null
    }
  ],
  "categories": ["work", "personal", "shopping"],
  "labels": ["urgent", "important", "blocked"]
}
```

---

## Document Notes
- Created as Plan Phase baseline for todo-app feature
- Ready for Design phase review
- All functional requirements confirmed by user
- Risk mitigation strategies in place
