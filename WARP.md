# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository overview

- **Backend**: Python 3 + FastAPI app in `backend/app`. The `backend/package.json` and any Node/Prisma files are legacy scaffolding and can be ignored; the active backend is the Python code under `backend/app` (per `README.md`).
- **Frontend**: React + Vite app in `frontend`.

See `README.md` in the repo root for the full assignment description and TODOs for both backend and frontend.

## Commands

### Backend – FastAPI API (Python)

All commands assume you run them from the repo root unless noted.

- **Create virtualenv (if not present)**
  - PowerShell:
    - `cd backend`
    - `python -m venv .venv`
- **Activate virtualenv (PowerShell)**
  - `cd backend`
  - `. .venv/Scripts/Activate.ps1`
- **Run dev server (with reload)**
  - `cd backend`
  - (venv activated)
  - `python -m uvicorn app.main:app --reload --port 8000`
  - API root: `http://localhost:8000/`
  - Swagger UI: `http://localhost:8000/docs`
  - ReDoc: `http://localhost:8000/redoc`

**Tests / linting (backend)**

- There is currently **no** Python dependency file (`requirements.txt` / `pyproject.toml`) and **no** test or lint configuration in `backend/`. When adding tests (e.g. `pytest`) or linters (e.g. Ruff, Flake8), prefer project-level scripts so they can be documented here.

### Frontend – React + Vite

From the repo root:

- **Install dependencies**
  - `cd frontend`
  - `npm install`
- **Run dev server**
  - `cd frontend`
  - `npm run dev`
  - Default dev URL: `http://localhost:5173/`
- **Build for production**
  - `cd frontend`
  - `npm run build`
- **Preview built app**
  - `cd frontend`
  - `npm run preview`
- **Lint frontend code**
  - `cd frontend`
  - `npm run lint`
  - Uses `eslint.config.js` (flat config) with recommended JS + React + React Hooks + React Refresh rules.

**Tests (frontend)**

- There is currently **no** `test` script configured in `frontend/package.json`. If a test runner (e.g. Vitest, Jest) is added later, add the commands (including how to run a single test file) here.

## Backend architecture

The backend is a FastAPI app organized as a Python package under `backend/app`:

- `backend/app/main.py`
  - Creates the FastAPI app instance (`app = FastAPI(...)`).
  - Defines a basic `/health` endpoint used as a health check.
  - As the backend evolves, this module is the natural place to mount versioned API routers (e.g. `app.include_router(...)` for `api.v1`).

- `backend/app/api/v1/endpoints/`
  - Intended location for versioned API route modules (e.g. `users`, `auth`, `tasks`).
  - Endpoints defined here should be exposed via routers that get included from `app/main.py` under a common prefix like `/api/v1`.

- `backend/app/models/`
  - Intended for ORM/database models (e.g. SQLAlchemy models for `User`, `Task`, etc.), consistent with the README note that the backend should use PostgreSQL (or SQLite locally) via SQLAlchemy.

- `backend/app/schemas/`
  - Intended for Pydantic models that define request/response schemas separate from ORM models.
  - Keeps external API contracts decoupled from persistence layer details.

- `backend/app/db/`
  - Reserved for database configuration: engine creation, session/local dependency wiring for FastAPI, and any migration/bootstrap helpers.

- `backend/app/core/`
  - Intended for cross-cutting concerns: configuration (settings), security/auth helpers (JWT handling, password hashing utilities), and other shared logic that should not live directly in route handlers.

At the moment, most of these packages only contain `__init__.py` and serve as placeholders for the structure above; future work should populate them in line with these responsibilities.

## Frontend architecture

The frontend is a standard Vite + React (JavaScript) app under `frontend/`:

- `frontend/src/main.jsx`
  - Entry point that creates the React root and renders `<App />` into the DOM element with id `root`.
  - This is the natural place to add top-level context providers (e.g. auth context) and any routing setup once React Router or similar is introduced.

- `frontend/src/App.jsx`
  - Currently the default Vite counter demo.
  - Per the root `README.md`, this component (and its descendants) should evolve into pages for **Register**, **Login**, and **Dashboard**, plus UI to exercise the backend CRUD APIs.

- `frontend/eslint.config.js`
  - Flat ESLint configuration applied to `**/*.{js,jsx}` with recommended JS rules, React Hooks rules, and React Refresh integration.
  - Enforces, among other things, that unused variables are disallowed except when they match an all-caps/underscore pattern (via `varsIgnorePattern: '^[A-Z_]'`).

- `frontend/vite.config.js`
  - Vite configuration enabling the React plugin; use this if you need to set up proxies to the FastAPI backend (e.g. forwarding `/api` to `http://localhost:8000`).

## Assignment / behavior context for agents

- The root `README.md` describes this as a **Backend Developer (Intern)** assignment focused on building a secure, scalable REST API in FastAPI with auth + RBAC, plus a simple React frontend that uses those APIs.
- The README also lists concrete next steps for both backend and frontend (e.g. adding `User`/`Task` models, implementing JWT-based login and role-based access, replacing the Vite starter UI with auth and dashboard pages). When making substantial changes, prefer to keep that README in sync with the current capabilities of the code.
- There are currently no additional tool-specific rule files (e.g. `CLAUDE.md`, `.cursorrules`, GitHub Copilot instructions); this `WARP.md` is the primary project-scoped guidance for agents.
