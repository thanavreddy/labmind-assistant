# LabMind Assistant Backend

FastAPI-based backend for the LabMind AI-powered lab completion platform.

## Features

- **AI Chat Assistant**: OpenAI-powered conversational learning assistance
- **Quiz System**: AI-evaluated open-ended comprehension questions
- **Lab Records**: Full CRUD operations for lab documentation
- **Experiment Management**: Course and experiment tracking
- **Authentication**: JWT-based auth with Supabase integration
- **Professor Dashboard**: Class analytics and student tracking

## Tech Stack

- **Framework**: FastAPI
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI API (ChatGPT)
- **Authentication**: Supabase Auth + JWT
- **Server**: Uvicorn
- **Testing**: Pytest + pytest-asyncio

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Settings & configuration
│   ├── database.py          # Supabase client setup
│   ├── models.py            # Pydantic models
│   ├── auth.py              # JWT authentication & middleware
│   ├── services.py          # Business logic (AI services)
│   └── routes/
│       ├── __init__.py
│       ├── health.py        # Health check endpoints
│       ├── chat.py          # Chat/AI endpoints
│       ├── quiz.py          # Quiz endpoints
│       ├── lab_records.py   # Lab record endpoints
│       └── experiments.py   # Experiment endpoints
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
├── .gitignore
└── README.md
```

## Setup & Installation

### 1. Prerequisites

- Python 3.11+
- pip or conda
- Supabase account (free at supabase.com)
- OpenAI API key (get at openai.com/api)

### 2. Clone & Navigate

```bash
cd backend
```

### 3. Create Virtual Environment

```bash
# Using venv (recommended)
python3.11 -m venv venv

# Activate
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables

```bash
# Copy the example
cp .env.example .env

# Edit .env and fill in:
# - SUPABASE_URL (from supabase dashboard)
# - SUPABASE_KEY (anon key)
# - SUPABASE_SERVICE_KEY (service key)
# - OPENAI_API_KEY (from openai.com)
# - SECRET_KEY (generate a random string)
```

Get your Supabase credentials:
1. Create a project at [supabase.com](supabase.com/dashboard)
2. Go to **Settings → API** to find:
   - Project URL
   - Anon Key (public)
   - Service Role Key (private)

### 6. Run the Server

```bash
# Development (with hot reload)
python -m uvicorn app.main:app --reload --port 8000

# Production
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

## API Documentation

Once running, visit:
- **Interactive Docs**: http://localhost:8000/docs (Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc (ReDoc)
- **Health Check**: http://localhost:8000/api/health

## API Endpoints

### Health
- `GET /api/health` - Server health check

### Chat (AI Assistant)
- `POST /api/chat/send` - Send message to AI assistant
- `GET /api/chat/history/{experiment_id}` - Get chat history

### Quiz (Comprehension Check)
- `GET /api/quiz/questions/{experiment_id}` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/score/{experiment_id}` - Get quiz score

### Lab Records
- `POST /api/records/save` - Save lab record
- `GET /api/records/{record_id}` - Get specific record
- `GET /api/records/experiment/{experiment_id}` - Get records by experiment
- `POST /api/records/{record_id}/export` - Export as PDF
- `DELETE /api/records/{record_id}` - Delete record

### Experiments
- `GET /api/experiments` - List experiments
- `GET /api/experiments/{experiment_id}` - Get experiment details
- `POST /api/experiments/{experiment_id}/start` - Start experiment
- `GET /api/experiments/{experiment_id}/progress` - Get student progress
- `POST /api/experiments/{experiment_id}/complete` - Mark as completed
- `GET /api/experiments/professor/class/students` - List class students (professor only)
- `GET /api/experiments/professor/analytics/{course_id}` - Class analytics (professor only)

## Database Schema

### Tables to Create in Supabase

```sql
-- Profiles (already created by Supabase Auth)
-- public.profiles:
-- - id (UUID, FK to auth.users)
-- - email (TEXT)
-- - full_name (TEXT)
-- - role (TEXT: 'student' | 'professor')
-- - created_at (TIMESTAMP)

-- Experiments
CREATE TABLE experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    course TEXT NOT NULL, -- CS201, CS301, CS302
    created_at TIMESTAMP DEFAULT now()
);

-- Experiment Submissions (student progress)
CREATE TABLE experiment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id),
    experiment_id UUID NOT NULL REFERENCES experiments(id),
    status TEXT DEFAULT 'pending', -- pending, in_progress, completed
    progress FLOAT DEFAULT 0, -- 0-100
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Comprehension Answers (quiz submissions)
CREATE TABLE comprehension_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id),
    experiment_id UUID NOT NULL REFERENCES experiments(id),
    answers JSONB NOT NULL, -- {"question_id": "answer_text"}
    score FLOAT NOT NULL, -- 0-100
    submitted_at TIMESTAMP DEFAULT now()
);

-- Lab Records
CREATE TABLE lab_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id),
    experiment_id UUID NOT NULL REFERENCES experiments(id),
    aim TEXT,
    theory TEXT,
    algorithm TEXT,
    code TEXT,
    output TEXT,
    conclusion TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- AI Conversations (optional)
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id),
    experiment_id UUID NOT NULL REFERENCES experiments(id),
    role TEXT NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);
```

## Development

### Running Tests

```bash
pytest

# With coverage
pytest --cov=app

# Specific test file
pytest tests/test_routes.py -v
```

### Code Style

```bash
# Format code
black app/

# Lint
pylint app/

# Type checking
mypy app/
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-----------|----------|
| `SUPABASE_URL` | Supabase project URL | ✅ |
| `SUPABASE_KEY` | Supabase anon key | ✅ |
| `SUPABASE_SERVICE_KEY` | Supabase service key | ✅ |
| `DATABASE_URL` | PostgreSQL connection string | ⚠️ |
| `OPENAI_API_KEY` | OpenAI API key | ✅ |
| `SECRET_KEY` | JWT secret key | ✅ |
| `ALGORITHM` | JWT algorithm | (HS256) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry | (30) |
| `DEBUG` | Debug mode | (False) |
| `ENVIRONMENT` | Environment name | (development) |
| `ALLOWED_ORIGINS` | CORS origins | (localhost) |
| `HOST` | Server host | (0.0.0.0) |
| `PORT` | Server port | (8000) |

## Next Steps

1. **Set up Supabase tables** using the SQL schema above
2. **Load sample data** for courses and experiments
3. **Implement TODO items** in routes (Supabase queries, error handling)
4. **Create test suite** for all endpoints
5. **Set up CI/CD** pipeline
6. **Deploy** to production (Railway, Vercel, AWS, etc.)

## Frontend Integration

The frontend expects the backend at `VITE_API_URL` environment variable (typically `http://localhost:8000`).

### Request Headers

All authenticated requests should include:
```
Authorization: Bearer <jwt_token>
```

### Response Format

```json
{
    "data": { },      // Success response
    "error": "string" // Error response
}
```

## Troubleshooting

### Connection Issues
- Verify Supabase URL and keys in `.env`
- Check CORS origins include frontend URL
- Ensure both services are running

### OpenAI Errors
- Verify API key is valid
- Check rate limits haven't been exceeded
- Ensure account has credits/payment method

### Database Errors
- Run the SQL schema to create tables
- Check Supabase service is operational
- Verify row-level security policies if needed

## Contributing

1. Create a feature branch
2. Make changes
3. Add tests
4. Submit pull request

## License

MIT

## Support

For issues or questions, open an issue on GitHub or contact the team.
