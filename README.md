# Tasks Tracker React

## Features

*   **Project Management**: Create, edit, and delete projects.
*   **Issue Tracking**: Full CRUD functionality for tasks, including changing status, type, and assignee.
*   **Drag & Drop Interface**: A modern, accessible drag-and-drop system powered by `@dnd-kit`.
*   **Team Management**: Invite and remove members, and manage user roles.
*   **Authentication**: A complete session-based login/logout system using JWT.

## Architecture & Technology Stack

The project is built upon the principles of **Clean Architecture** and **Domain-Driven Design (DDD)**, ensuring a loosely coupled, highly testable, and scalable codebase.

### Architectural Layers:

*   **`src/domain`**: The core of the business logic. It contains framework-agnostic types, interfaces, and pure functions.
*   **`src/app`**: The application layer (use-cases). It orchestrates the business logic to fulfill specific application scenarios.
*   **`src/infra`**: The infrastructure layer. It contains implementations of external dependencies such as API clients, data mappers (ACL), `localStorage` interactions, etc.
*   **`src/ui`**: The presentation layer. It's responsible for everything the user sees, including components, pages, routing, and styles.

### Core Stack & State Management:

*   **React 19 & TypeScript**: For building the user interface with strong type safety.
*   **Vite + SWC**: A next-generation build tool that provides a lightning-fast development experience.
*   **TanStack Query**: For server state management (caching, synchronization, and data fetching).
*   **Zustand**: For lightweight and flexible client state management.
*   **React Router**: For handling client-side routing.

### UI & Styling:

*   **Tailwind CSS**: A utility-first CSS framework for rapid and custom UI development.
*   **Radix UI**: A foundation of accessible, unstyled, headless components.
*   **Shadcn UI**: A collection of reusable components built on Radix UI and Tailwind CSS.
*   **Storybook**: For developing and documenting UI components in isolation.

### Data Handling & Validation:

*   **Valibot**: A modern, lightweight, and modular library for data validation.
*   **`neverthrow`**: For robust and type-safe functional error handling, avoiding the ambiguity of `try...catch` blocks.

### Testing & Code Quality:

*   **Vitest**: A modern testing framework with UI, browser mode, and coverage reporting.
*   **Playwright**: For robust End-to-End (E2E) testing.
*   **ESLint & Prettier**: A comprehensive setup with `@antfu/eslint-config` for maintaining a consistent, high-quality codebase.
*   **Pre-commit Hooks**: All code is automatically linted, formatted, type-checked, and tested before every commit to ensure repository health.

## Architectural Improvement Ideas

- Introduce ports in `src/app/ports/*` and refactor `src/app/use-cases/*` to depend on ports -> to break `app -> infra` and simplify unit tests.
- Add adapters in `src/infra/adapters/*` (http, token-storage, router, notifier) -> to isolate infrastructure and avoid direct infra imports in app/UI.
- Move React Query hooks from `src/app/query-hooks/*` to `src/ui/query-hooks/*` -> so the app layer does not depend on React.
- Keep `.deps.ts` only where external dependencies are needed and pass callbacks/handlers down instead of a deep `deps` object -> to avoid prop drilling of deps while keeping "dumb UI".
- Remove direct infra imports from UI (e.g., `src/ui/router/protected-route.tsx`) -> to keep props-based DI consistent.
- Split `src/shared` into `src/shared/lib` (pure utilities) and `src/ui/shared` (JSX/React-dependent) -> to keep shared truly framework-agnostic.
- Replace `useSession` usage in infra with a `TokenStoragePort` -> to avoid infra depending on Zustand/localStorage.
- Split pages into container/view (thin container, dumb view) -> to keep UI testable as dumb components while wiring stays local.

## Development & Available Scripts

This project uses `pnpm` for dependency management. All commands should be run with it.

1.  **Clone and Install:**
    ```bash
    git clone <your-repo-url>
    cd tasks-tracker-react
    pnpm install
    ```

2.  **Core Commands:**

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts the development server with Vite. |
| `pnpm build` | Lints types and builds the app for production. |
| `pnpm preview` | Serves the production build locally for preview. |

3.  **Testing:**

| Command | Description |
| :--- | :--- |
| `pnpm test:vitest` | Runs all application unit and integration tests with Vitest. |
| `pnpm test:storybook` | Runs tests specifically for Storybook components. |

4.  **Code Quality & Linting:**

| Command | Description |
| :--- | :--- |
| `pnpm lint:code` | Lints the codebase with ESLint and attempts to fix issues. |
| `pnpm lint:types` | Performs a TypeScript type check across the project. |
| `pnpm lint:format` | Formats all relevant files using Prettier. |

5.  **Storybook:**

| Command | Description |
| :--- | :--- |
| `pnpm storybook:dev` | Starts the Storybook development server. |
| `pnpm storybook:build` | Builds Storybook as a static web application. |
