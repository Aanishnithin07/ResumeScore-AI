#!/bin/bash

# ResumeScore Setup Script
echo "🚀 Setting up ResumeScore..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3.8+ from https://python.org"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup Backend
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

echo "✅ Backend setup complete"

# Setup Frontend
echo "🔧 Setting up frontend..."
cd ../frontend

# Install dependencies
npm install

# Copy environment file
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "📝 Created .env.local file"
fi

echo "✅ Frontend setup complete"

echo ""
echo "🎉 Setup complete! To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  uvicorn main:app --reload"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""