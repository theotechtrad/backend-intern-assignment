# Backend Intern Assignment – Auth API + React Frontend

This project is for a **Backend Developer (Intern)** assignment. The main goal is to build a secure, scalable REST API in **Python (FastAPI)** with authentication and role-based access, plus a simple **React (Vite)** frontend to exercise the APIs.

## Tech Stack

**Backend**
- Python 3
- FastAPI
- Uvicorn (ASGI server)
- PostgreSQL (via SQLAlchemy + psycopg2-binary; can start locally with SQLite and switch via env vars)
- JWT auth (`python-jose`)
- Password hashing (`passlib[bcrypt]`)

**Frontend**
- React (Vite template)
- JavaScript (ESM)

> Note: The `backend` folder previously contained some Node/Prisma scaffolding. The new Python backend lives in `backend/app`. The existing Node files can be ignored for this assignment.

## Project Structure

- `backend/`
  - `.venv/` – Python virtual environment (created locally)
  - `app/` – FastAPI application package
    - `main.py` – FastAPI app with `/health` endpoint (more APIs to be implemented)
- `frontend/`
  - Vite React app (`package.json`, `src/`, `public/`, etc.)

## Getting Started

### 1. Backend (FastAPI)

From the project root:

```bash
cd backend
# PowerShell: activate virtualenv
. .venv/Scripts/Activate.ps1

# Run the dev server
python -m uvicorn app.main:app --reload --port 8000
```

Then open:
- API root: http://localhost:8000
- Docs (Swagger UI): http://localhost:8000/docs
- Docs (ReDoc): http://localhost:8000/redoc

### 2. Frontend (React + Vite)

From the project root:

```bash
cd frontend
npm install
npm run dev
```

By default, Vite serves on http://localhost:5173.

## Next Steps / TODO

Backend:
- Add database models for `User` and `Task` (or `Note`/`Product`).
- Implement user registration & login with password hashing and JWT.
- Enforce role-based access control (`user` vs `admin`).
- Implement CRUD APIs for the secondary entity (e.g. `/api/v1/tasks`).
- Add validation, error handling, and proper status codes.
- Add API documentation details (extra descriptions, examples, Postman collection).

Frontend:
- Replace starter Vite content with pages for **Register**, **Login**, and **Dashboard**.
- Store JWT on login and attach it in the `Authorization` header.
- Add forms and UI to perform CRUD on the entity using the backend APIs.

Other:
- Add a short scalability note (microservices, caching, load balancing) to this README.
- Optionally add Docker and/or Redis caching.
