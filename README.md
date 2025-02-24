# Createathon Backend

Createathon is an interactive learning platform designed to provide coding  challenges for users. The backend is built using Django for core logic and FastAPI for high-performance microservices.

## 🚀 Features
- **User Authentication & Authorization** (Django + DRF)
- **Challenge Management** (CRUD operations for coding & quiz challenges)
- **Submission System** (Stores user submissions and evaluates code challenges)
- **FastAPI Execution Service** (Handles code execution in an isolated environment)
- **Progress Tracking** (Monitors user attempts and challenge completion)

## 🏗️ Tech Stack
- **Django** (Backend Framework)
- **Django REST Framework (DRF)** (API Development)
- **FastAPI** (Code Execution Microservice)
- **PostgreSQL** (Database)



## ⚡ Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/mokshanirugutti/Createathon.git
cd createathon
```

- ### 1️⃣ Backend steup
    ```bash
    cd backend
    ```

- ### 2️⃣ Set Up Virtual Environment
    ```bash
    python -m venv env
    source env/bin/activate  # On Windows: env\Scripts\activate
    ```
- ### 3️⃣ Install Dependencies
    ```bash
    pip install -r requirements.txt
    ```

- ### 4️⃣ Apply Migrations
    ```bash
    python manage.py migrate
    ```
- ### 5️⃣ Run Django Server
    ```bash
    python manage.py runserver
    ```

- ### 6️⃣ Run FastAPI Execution Service
    ```bash
    cd execution_service
    uvicorn main:app --host 0.0.0.0 --port 8001 --reload 
    ```

## 🛠 API Endpoints
### Authentication
- `POST /api/auth/login/` - User Login
- `POST /api/auth/register/` - User Registration

### Challenges
- `GET /api/challenges/` - List All Challenges
- `POST /api/challenges/` - Create a Challenge
- `GET /api/challenges/{id}/` - Challenge Details

### Submissions
- `POST /api/submissions/` - Submit Code for Evaluation
- `GET /api/submissions/` - List User Submissions (Read-Only)
- `GET /api/submissions/{id}` - single Submission (Read-Only)

---
