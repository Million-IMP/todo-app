# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fullstack application with separate frontend and backend services.

## Directory Structure

```
project/
├── backend/          # Backend API server
├── frontend/         # Frontend web application
├── docs/             # Project documentation
├── .github/          # GitHub workflows and config
└── .claude/          # Claude Code settings (local)
```

## Technology Stack

**Frontend:** (configure as project develops)
- Framework: React / Vue / Next.js (or your choice)
- Build tool: Vite / Webpack / Next.js
- Package manager: npm / yarn / pnpm
- State management: (if needed)

**Backend:** (configure as project develops)
- Runtime: Node.js / Python / Go (or your choice)
- Framework: Express / Fastify / Django / Flask (or your choice)
- Database: PostgreSQL / MongoDB (or your choice)
- Package manager: npm / pip / go mod

## Common Development Commands

Update these as your project is set up.

```bash
# Frontend setup & development
npm install              # Install frontend dependencies
npm run dev             # Start frontend dev server
npm run build           # Build frontend for production
npm run lint            # Run linter
npm run test            # Run frontend tests
npm run test:single     # Run a single test file

# Backend setup & development
npm install             # Install backend dependencies
npm run dev             # Start backend dev server
npm run build           # Build backend
npm run test            # Run backend tests
npm run test:single     # Run a single test file

# Full stack
npm run dev:all         # Start both frontend and backend
```

## Architecture Notes

### Backend
- **Entry point:** Configure based on framework (e.g., `src/index.js` for Node.js)
- **API routes:** Organized by resource type
- **Database:** Configure connection pooling and migrations as needed
- **Authentication:** Implement at API boundary; use middleware for route protection

### Frontend
- **Entry point:** Configure based on framework (e.g., `src/main.jsx` for React + Vite)
- **Components:** Organize by feature or page
- **API client:** Create a single client wrapper for backend communication
- **State:** Keep local component state for UI; use state management for app-wide state if needed

### API Communication
- Use a centralized API client to handle base URL, headers, and error handling
- Keep backend routes RESTful and predictable
- Document API endpoints in comments or a separate file

## Development Workflow

1. **Feature branches:** Create feature branches from `main` or `develop`
2. **Before commit:**
   - Run linter: `npm run lint` (or equivalent)
   - Run tests: `npm run test` (or equivalent)
3. **Pull requests:** Reference issues, provide context on changes
4. **Code review:** Check both frontend and backend changes for consistency

## Key Conventions

- Keep frontend and backend concerns separate
- Use environment variables for configuration (different dev/staging/prod values)
- Frontend should handle UI logic; backend should handle business logic
- Document non-obvious decisions in comments or in code

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (if available)
npm run test:watch

# Run a specific test file
npm run test -- path/to/test.js
```

## Configuration Files

- `.env` / `.env.local` - Environment variables (add to .gitignore)
- `.eslintrc` / `.prettierrc` - Linting and formatting (if using)
- `package.json` - Project metadata and scripts
- `tsconfig.json` - TypeScript configuration (if using TypeScript)

## Debugging

- **Frontend:** Use browser DevTools (F12) and React DevTools browser extension
- **Backend:** Use `console.log` or a debugger (add breakpoints in VS Code)
- **API:** Use a tool like Postman, Insomnia, or VS Code REST Client extension

## Performance Considerations

- **Frontend:** Monitor bundle size with build tool plugins
- **Backend:** Use database indexes appropriately; consider caching for frequently accessed data
- **Communication:** Minimize number of API calls; use pagination for large datasets

## Security Notes

- Validate all user input on the backend
- Use HTTPS in production
- Store sensitive data (keys, tokens) in environment variables, never in code
- Implement authentication/authorization at the API level
- Sanitize output to prevent XSS attacks

## When Adding New Features

1. Create a feature branch
2. Implement frontend changes if needed
3. Implement backend changes if needed
4. Update tests for both frontend and backend
5. Verify API integration works end-to-end
6. Create a pull request with clear description
