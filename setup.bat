@echo off
echo 🚀 Setting up ResumeScore...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 3 is required but not installed.
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is required but not installed.
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Setup Backend
echo 🔧 Setting up backend...
cd backend

REM Create virtual environment
python -m venv venv
call venv\Scripts\activate.bat

REM Install dependencies
pip install -r requirements.txt

REM Download spaCy model
python -m spacy download en_core_web_sm

echo ✅ Backend setup complete

REM Setup Frontend
echo 🔧 Setting up frontend...
cd ..\frontend

REM Install dependencies
npm install

REM Copy environment file
if not exist .env.local (
    copy .env.example .env.local
    echo 📝 Created .env.local file
)

echo ✅ Frontend setup complete

echo.
echo 🎉 Setup complete! To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   venv\Scripts\activate.bat
echo   uvicorn main:app --reload
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo.
pause