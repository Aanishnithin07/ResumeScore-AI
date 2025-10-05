# Quick Start Guide 🚀

Get ResumeScore running locally in under 5 minutes!

## Prerequisites ✅

Before you begin, ensure you have:
- **Python 3.8+** installed ([Download](https://python.org))
- **Node.js 18+** installed ([Download](https://nodejs.org))
- **Git** installed ([Download](https://git-scm.com))

## Option 1: Automated Setup (Recommended) 🤖

### On macOS/Linux:
```bash
git clone <your-repo-url>
cd resume-score
chmod +x setup.sh
./setup.sh
```

### On Windows:
```cmd
git clone <your-repo-url>
cd resume-score
setup.bat
```

The setup script will:
- ✅ Check prerequisites
- ✅ Set up Python virtual environment
- ✅ Install all dependencies
- ✅ Download required AI models
- ✅ Configure environment files

## Option 2: Manual Setup 🛠️

### Step 1: Clone & Navigate
```bash
git clone <your-repo-url>
cd resume-score
```

### Step 2: Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm
```

### Step 3: Frontend Setup
```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

## Running the Application 🏃‍♂️

You'll need **two terminal windows**:

### Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## Access Your Application 🌐

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Test It Out! 🧪

1. Open http://localhost:3000
2. Click "Analyze My Resume"
3. Either:
   - Paste sample resume text, or
   - Upload a PDF/DOCX resume file
4. Watch the AI analyze your resume!
5. View your detailed score and suggestions

## Sample Resume Text 📝

Use this sample text to test the application:

```
John Doe
Senior Software Engineer
john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years developing scalable web applications using Python, JavaScript, and cloud technologies. Proven track record of leading cross-functional teams and delivering high-quality software solutions.

TECHNICAL SKILLS
• Programming Languages: Python, JavaScript, TypeScript, Java
• Frameworks: React, Node.js, Django, FastAPI, Express.js
• Databases: PostgreSQL, MongoDB, Redis, MySQL
• Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, Git
• Tools: Linux, Agile/Scrum, Test-Driven Development

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp Inc. | 2021 - Present
• Led development of microservices architecture serving 1M+ daily active users
• Implemented automated testing and CI/CD pipelines, reducing deployment time by 60%
• Collaborated with product managers and designers in agile environment
• Mentored junior developers and conducted code reviews

Software Developer | StartupXYZ | 2019 - 2021
• Developed and maintained RESTful APIs using Python Django and FastAPI
• Built responsive web applications using React and TypeScript
• Optimized database queries, improving application performance by 40%
• Participated in on-call rotation and incident response procedures

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2019
Relevant Coursework: Data Structures, Algorithms, Database Systems, Software Engineering

PROJECTS
• E-commerce Platform: Built full-stack application using React, Node.js, and PostgreSQL
• Data Pipeline: Created ETL pipeline processing 100GB+ daily data using Python and AWS
• Machine Learning Model: Developed recommendation system using scikit-learn
```

## What Happens Next? 📊

The AI will analyze your resume across four key areas:

1. **Grammar & Language** (25%) - Spelling, grammar, sentence structure
2. **Readability** (25%) - Clarity, flow, professional tone
3. **Keywords** (25%) - Industry terms, technical skills, action verbs
4. **Structure** (25%) - Formatting, organization, completeness

You'll receive:
- 🎯 Overall score (0-100)
- 📈 Category breakdown with individual scores
- 💡 Specific improvement suggestions
- 📄 Option to download PDF report

## Troubleshooting 🔧

### Common Issues:

**"Module not found" errors:**
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**spaCy model not found:**
```bash
python -m spacy download en_core_web_sm
```

**Port already in use:**
```bash
# Kill processes on ports 3000 and 8000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**CORS errors:**
- Ensure backend is running on port 8000
- Check that frontend `.env.local` has correct API URL

### Still having issues?

1. Check the [full README](README.md) for detailed setup
2. Review [Deployment Guide](DEPLOYMENT.md) for production setup
3. Open an issue on GitHub with:
   - Your operating system
   - Error messages
   - Steps you've tried

## Next Steps 🎯

### For Development:
- Explore the codebase structure
- Check out the component library in `frontend/components/`
- Review API endpoints in `backend/main.py`
- Run tests: `cd backend && pytest`

### For Production:
- Follow the [Deployment Guide](DEPLOYMENT.md)
- Set up monitoring and analytics
- Configure custom domain and SSL

### For Customization:
- Modify scoring algorithms in `backend/main.py`
- Customize UI themes in `frontend/tailwind.config.js`
- Add new analysis features
- Integrate with external APIs

---

**🎉 Congratulations! You now have ResumeScore running locally.**

**Need help?** Join our community or check the documentation for more advanced features and customization options.