# Backend Setup with Existing Supabase Project

This guide will help you connect the FastAPI backend to your existing Supabase project.

## Step 1: Get Your Supabase Credentials

1. Go to [supabase.com/dashboard](https://app.supabase.com/dashboard)
2. Click on your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** - Your `SUPABASE_URL`
   - **public (anon) key** - Your `SUPABASE_KEY`
5. Go to **Settings → API → Service Keys**
6. Copy **Service Role Secret** - Your `SUPABASE_SERVICE_KEY`

Keep these safe! You'll need them in the next step.

## Step 2: Create `.env` File

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# FastAPI Configuration
API_TITLE=LabMind Assistant API
API_VERSION=1.0.0
DEBUG=False
ENVIRONMENT=development

# JWT Configuration
SECRET_KEY=your-super-secret-key-change-in-production-12345
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI Configuration
OPENAI_API_KEY=sk-...

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173,http://localhost:3000

# Server Configuration
HOST=0.0.0.0
PORT=8000
```

## Step 3: Create Supporting Tables in Supabase

Your `profiles` table is already integrated with the frontend. Now you need to create the supporting tables for LabMind features.

1. Go to your Supabase project
2. Click **SQL Editor** (or go to **Database → SQL**)
3. Click **New Query**
4. Copy the entire contents of `database/setup.sql`
5. Paste it into the SQL editor
6. Click **Run**

This creates:
- `experiments` - Lab assignments
- `experiment_submissions` - Student progress tracking
- `comprehension_answers` - Quiz submissions
- `lab_records` - Lab documentation
- `ai_conversations` - Chat history (optional)
- Row Level Security (RLS) policies for security

## Step 4: (Optional) Load Sample Data

To add sample experiments for testing:

1. Go to **SQL Editor** again
2. Create a **New Query**
3. Copy the contents of `database/seed.sql`
4. Paste and run

This adds 7 sample experiments across CS201, CS301, and CS302 courses.

## Step 5: Install Python Dependencies

```bash
# Create and activate virtual environment
python3.11 -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

## Step 6: Run the Backend Server

```bash
# Development (with hot reload)
python -m uvicorn app.main:app --reload

# OR run directly
python main.py
```

The server runs at: **http://localhost:8000**

## Step 7: Test the Connection

Visit: **http://localhost:8000/docs**

You should see Swagger UI with all API endpoints. Try:

1. **GET /api/health** - Should return `{"status": "healthy", ...}`
2. **GET /api/experiments** - Should return sample experiments (if you ran seed.sql)

## What's Connected Now

### Frontend ↔️ Backend

| Feature | Frontend Table | Backend Table | Status |
|---------|---|---|---|
| Authentication | `profiles` (auth.users FK) | `profiles` (reused) | ✅ Working |
| Lab Assignments | N/A | `experiments` | ✅ New |
| Student Progress | N/A | `experiment_submissions` | ✅ New |
| Quiz Submissions | N/A | `comprehension_answers` | ✅ New |
| Lab Records | N/A | `lab_records` | ✅ New |
| Chat History | N/A | `ai_conversations` | ✅ New |

## Your Profiles Table Schema

```sql
profiles:
  - id (UUID) - FK to auth.users
  - email (VARCHAR 255) - unique
  - full_name (VARCHAR 255) - nullable
  - role (VARCHAR 50) - 'student' or 'professor'
  - department (VARCHAR 100) - nullable
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
```

The backend automatically works with this schema!

## Environment Variables Reference

| Variable | Value | Example |
|----------|-------|---------|
| `SUPABASE_URL` | Your project URL | https://xyz.supabase.co |
| `SUPABASE_KEY` | Public anon key | eyJhbG... |
| `SUPABASE_SERVICE_KEY` | Service key | eyJhbG... |
| `OPENAI_API_KEY` | OpenAI secret key | sk-... |
| `SECRET_KEY` | JWT secret | your-secret-key-123 |
| `DEBUG` | boolean | False |
| `ENVIRONMENT` | env name | development |
| `PORT` | server port | 8000 |

## Troubleshooting

### "Connection refused" error
- Check SUPABASE_URL is correct (should start with https://)
- Verify SUPABASE_KEY is the <u>anon key</u>, not the service key
- Ensure Supabase project is running

### "401 Unauthorized" when testing endpoints
- Endpoints require JWT tokens from frontend auth
- Test with Swagger UI which handles auth automatically
- Or manually add Authorization header: `Bearer <jwt_token>`

### "Table does not exist" error
- Run the `database/setup.sql` script
- Check that all SQL commands executed successfully
- Refresh Supabase dashboard to see new tables

### OpenAI errors
- Verify `OPENAI_API_KEY` is correct
- Check OpenAI account has credits/payment method
- Ensure API key has necessary permissions

## Next Steps

1. ✅ Connect .env with Supabase credentials
2. ✅ Create tables with setup.sql
3. ✅ (Optional) Load sample data with seed.sql
4. ✅ Start the backend server
5. 🔄 Test endpoints in Swagger UI
6. 🔄 Update routes to fully implement Supabase queries (marked with TODO comments)
7. 🔄 Integrate with frontend (update VITE_API_URL to http://localhost:8000)

## Support

For issues:
1. Check logs in terminal running the server
2. Visit http://localhost:8000/docs for API documentation
3. Check Supabase logs at https://app.supabase.com/project/[id]/logs
4. Review README.md for detailed API reference
