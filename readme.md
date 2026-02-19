# Jeeni Millet Mix E-commerce Platform

Jeeni is a full-stack e-commerce application built with FastAPI (Backend) and Angular (Frontend), designed for selling millet mix products. It features a robust backend with PostgreSQL and Redis, and a modern frontend interface.

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy (Async), Alembic, Pydantic
- **Frontend**: Angular 17, TailwindCSS
- **Database**: PostgreSQL
- **Caching**: Redis
- **Containerization**: Docker, Docker Compose

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) (v18+ recommended) for local frontend dev
- [Python](https://www.python.org/) (v3.10+) for local backend dev

## Quick Start (Docker)

The easiest way to run the application is using Docker Compose.

1.  **Clone the repository** (if you haven't already).

2.  **Configure Environment Variables**:
    Copy the example environment file in the backend directory.

    ```bash
    cp backend/.env.example backend/.env
    ```

    _Note: Update `SECRET_KEY` and other credentials in `.env` for production._

3.  **Start the services**:

    ```bash
    docker-compose up --build
    ```

4.  **Access the Application**:
    - Frontend: [http://localhost](http://localhost) (or port 80)
    - Backend API: [http://localhost:8000](http://localhost:8000)
    - API Documentation (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

## Local Development

### Backend (FastAPI)

1.  Navigate to the backend directory:

    ```bash
    cd backend
    ```

2.  Create and activate a virtual environment:

    ```bash
    # using uv (recommended if installed)
    uv venv
    # OR using standard python
    python -m venv venv

    # Activate (Windows)
    .\venv\Scripts\activate
    # Activate (Linux/Mac)
    source venv/bin/activate
    ```

3.  Install dependencies:

    ```bash
    # using uv
    uv pip install -r requirements.txt
    # OR using standard pip
    pip install -r requirements.txt
    ```

4.  Set up the database:
    Ensure you have a PostgreSQL instance running (e.g., via Docker) and that the `.env` file points to it.

    ```bash
    # Run migrations
    alembic upgrade head
    ```

5.  Run the application:
    ```bash
    uvicorn app.main:app --reload
    ```

### Frontend (Angular)

1.  Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the development server:

    ```bash
    npm start
    # OR
    ng serve
    ```

4.  Navigate to [http://localhost:4200/](http://localhost:4200/).

## Testing

### Backend

To run the backend tests:

```bash
cd backend
pytest
```

_Note: Ensure your test database environment needs are met._

## Project Structure

```
Jeeni/
├── backend/            # FastAPI backend
│   ├── app/            # Application source code
│   │   ├── core/       # Config, security, etc.
│   │   ├── models/     # SQLAlchemy models
│   │   ├── routers/    # API endpoints
│   │   └── schemas/    # Pydantic models
│   ├── alembic/        # Database migrations
│   └── tests/          # Tests
├── frontend/           # Angular frontend
│   ├── src/
│   │   ├── app/        # Angular components & modules
│   │   └── ...
│   └── ...
└── docker-compose.yml  # Docker orchestration
```
