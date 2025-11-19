# ResumeScore AI

A complete, production-ready full-stack website for AI-powered resume analysis with a beautiful new-retro aesthetic.
It provides the complete score of your resume under various aspects!

## 🌟 Features

- **AI-Powered Analysis**: Advanced NLP using spaCy and textstat for comprehensive resume evaluation
- **Beautiful UI**: Retro-futuristic design with glassmorphism effects and smooth animations
- **Multiple Input Methods**: Upload PDF/DOCX files or paste text directly
- **Detailed Scoring**: Category-wise breakdown (Grammar, Readability, Keywords, Structure)
- **Actionable Insights**: Specific suggestions for resume improvement
- **PDF Reports**: Download detailed analysis reports
- **Responsive Design**: Works perfectly on all device sizes

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Radix UI** - Accessible UI components
- **Axios** - HTTP client for API communication

### Backend
- **FastAPI** - High-performance Python web framework
- **spaCy** - Advanced natural language processing
- **textstat** - Readability analysis
- **PyPDF2 & python-docx** - Document parsing
- **Pydantic** - Data validation and settings management

## 📁 Project Structure

```
resume-score/
├── frontend/                 # Next.js React application
│   ├── app/                 # App router pages
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utility functions and API client
│   └── public/              # Static assets
└── backend/                 # FastAPI Python application
    ├── main.py              # Main application file
    ├── test_main.py         # Test suite
    └── requirements.txt     # Python dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download spaCy model:**
   ```bash
   python -m spacy download en_core_web_sm
   ```

5. **Start the development server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest test_main.py -v
```

### Frontend (Optional)
```bash
cd frontend
npm test
```

## 📊 API Endpoints

### POST `/analyze`
Analyze resume text and return detailed scores.

**Request:**
```json
{
  "text": "Your resume text here..."
}
```

**Response:**
```json
{
  "overall_score": 84,
  "breakdown": {
    "grammar": 90,
    "readability": 78,
    "keywords": 88,
    "structure": 80
  },
  "suggestions": {
    "grammar": "Minor sentence fragment issues.",
    "readability": "Try shorter sentences.",
    "keywords": "Add industry-specific terms like 'machine learning'.",
    "structure": "Add bullet points to skills section."
  }
}
```

### POST `/analyze/file`
Upload and analyze resume files (PDF, DOCX, TXT).

**Request:** Multipart form data with file upload

**Response:** Same as `/analyze`

### GET `/health`
Health check endpoint for monitoring.

## 🎨 Design Features

### New-Retro Aesthetic
- **Colors**: Dark purple background (#0d0221), neon pink (#ff6ec7), cyan (#05d9e8)
- **Fonts**: Orbitron (headings), Inter (body text)
- **Effects**: Glassmorphism cards, neon glows, animated gradients
- **Animations**: Floating elements, radar scanning, smooth transitions

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized typography scaling

## 🚢 Deployment

### Frontend (Vercel)

1. **Connect repository to Vercel:**
   - Import your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `.next`

2. **Environment variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

### Backend (Render/Railway)

1. **Create new web service**
2. **Connect repository**
3. **Set build command:**
   ```bash
   pip install -r requirements.txt && python -m spacy download en_core_web_sm
   ```
4. **Set start command:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

### Alternative: Docker Deployment

**Backend Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN python -m spacy download en_core_web_sm

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend (.env):**
```
PORT=8000
HOST=0.0.0.0
```

## 📈 Performance Optimization

### Frontend
- Next.js automatic code splitting
- Image optimization with next/image
- Lazy loading of components
- Efficient bundle sizing

### Backend
- FastAPI's automatic async handling
- Efficient NLP model loading
- Request validation with Pydantic
- Proper error handling and logging

## 🛡️ Security & Privacy

- **Data Privacy**: Resume data is not stored permanently
- **CORS Configuration**: Properly configured for production
- **Input Validation**: Comprehensive validation on all endpoints
- **Error Handling**: Safe error messages without sensitive data exposure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **spaCy** for powerful NLP capabilities
- **Textstat** for readability analysis
- **FastAPI** for the excellent Python web framework
- **Next.js** for the React framework
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for beautiful animations

## 📞 Support

If you have any questions or run into issues:

1. Check the [Issues](https://github.com/yourusername/resume-score/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Built with ❤️ for job seekers everywhere**
