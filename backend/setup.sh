#!/bin/bash

# LabMind Backend Setup Script
# This script sets up the FastAPI backend for development

set -e

echo "🚀 LabMind Backend Setup"
echo "========================"
echo ""

# Check Python version
echo "✓ Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "  Python version: $python_version"
echo ""

# Create virtual environment
echo "✓ Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate
echo "  venv created and activated"
echo ""

# Install dependencies
echo "✓ Installing dependencies..."
pip install -r requirements.txt
echo "  Dependencies installed"
echo ""

# Copy .env file
if [ ! -f .env ]; then
    echo "✓ Creating .env file from template..."
    cp .env.example .env
    echo "  ⚠️  IMPORTANT: Edit .env with your credentials:"
    echo "     - SUPABASE_URL"
    echo "     - SUPABASE_KEY"
    echo "     - SUPABASE_SERVICE_KEY"
    echo "     - OPENAI_API_KEY"
    echo "     - SECRET_KEY"
else
    echo "✓ .env file already exists"
fi
echo ""

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env with your Supabase and OpenAI credentials"
echo "2. Create database tables (see README.md for SQL schema)"
echo "3. Run: python -m uvicorn app.main:app --reload"
echo ""
echo "📚 Documentation:"
echo "- README.md: Full setup guide"
echo "- Swagger UI: http://localhost:8000/docs"
echo ""
