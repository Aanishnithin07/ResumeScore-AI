from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
# Removed spacy dependency - using NLTK instead
import textstat
import re
from typing import Dict, List
import io
import logging
from docx import Document
import PyPDF2
import nltk
from collections import Counter
import numpy as np

# Download required NLTK data
import os

def ensure_nltk_data():
    """Ensure NLTK data is downloaded"""
    try:
        # Try to download NLTK data
        import nltk
        nltk.download('punkt', quiet=True)
        nltk.download('stopwords', quiet=True) 
        nltk.download('wordnet', quiet=True)
        print("NLTK data downloaded successfully")
        return True
    except Exception as e:
        print(f"Warning: Could not download NLTK data: {e}")
        # Try alternative approach
        try:
            import nltk.data
            nltk.data.find('tokenizers/punkt')
            print("NLTK punkt tokenizer found")
            return True
        except LookupError:
            print("Warning: NLTK punkt tokenizer not available")
            return False

# Download NLTK data on startup
ensure_nltk_data()

# Initialize FastAPI app
app = FastAPI(
    title="ResumeScore API",
    description="AI-powered resume analysis API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://resumescore-525o5gi4s-aanishnithin07-2516s-projects.vercel.app",
        "https://resumescore-b2920c58j-aanishnithin07-2516s-projects.vercel.app",
        "https://*.vercel.app",
        "*"  # Allow all for now, restrict in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize NLTK components
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Initialize NLTK components with error handling
stop_words = set()
lemmatizer = None

def init_nltk_components():
    """Initialize NLTK components with proper error handling"""
    global stop_words, lemmatizer
    try:
        stop_words = set(stopwords.words('english'))
        lemmatizer = WordNetLemmatizer()
        print("NLTK components initialized successfully")
    except LookupError as e:
        print(f"LookupError: {e}. Attempting to download missing data...")
        try:
            nltk.download('stopwords', quiet=True)
            nltk.download('wordnet', quiet=True)
            stop_words = set(stopwords.words('english'))
            lemmatizer = WordNetLemmatizer()
            print("NLTK components initialized after download")
        except Exception as retry_e:
            print(f"Failed to initialize NLTK components: {retry_e}")
            # Fallback to basic stopwords
            stop_words = set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'])
            lemmatizer = None
    except Exception as e:
        print(f"Unexpected error initializing NLTK: {e}")
        stop_words = set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'])
        lemmatizer = None

# Initialize components
init_nltk_components()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models
class ResumeTextRequest(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    overall_score: int
    breakdown: Dict[str, int]
    suggestions: Dict[str, str]

# Industry keywords for different sectors
INDUSTRY_KEYWORDS = {
    'technology': [
        'python', 'java', 'javascript', 'react', 'node.js', 'sql', 'aws', 'docker',
        'kubernetes', 'machine learning', 'ai', 'data science', 'agile', 'scrum',
        'git', 'api', 'microservices', 'cloud', 'devops', 'ci/cd', 'mongodb',
        'postgresql', 'redis', 'elasticsearch', 'tensorflow', 'pytorch'
    ],
    'business': [
        'management', 'leadership', 'strategy', 'operations', 'marketing',
        'sales', 'finance', 'budgeting', 'planning', 'analysis', 'reporting',
        'project management', 'team building', 'negotiation', 'communication'
    ],
    'design': [
        'ui/ux', 'photoshop', 'illustrator', 'figma', 'sketch', 'prototyping',
        'wireframing', 'design thinking', 'user research', 'branding', 'typography',
        'color theory', 'responsive design', 'accessibility'
    ],
    'healthcare': [
        'patient care', 'medical', 'healthcare', 'nursing', 'clinical', 'diagnosis',
        'treatment', 'emr', 'hipaa', 'medical records', 'pharmacology'
    ],
    'finance': [
        'financial analysis', 'accounting', 'excel', 'financial modeling',
        'risk management', 'compliance', 'audit', 'gaap', 'sox', 'cpa'
    ]
}

# Common action verbs for resumes
ACTION_VERBS = [
    'achieved', 'administered', 'analyzed', 'coordinated', 'created', 'developed',
    'directed', 'established', 'evaluated', 'executed', 'generated', 'implemented',
    'improved', 'increased', 'initiated', 'led', 'managed', 'organized', 'planned',
    'produced', 'reduced', 'resolved', 'supervised', 'trained', 'transformed'
]

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting PDF text: {e}")
        raise HTTPException(status_code=400, detail="Unable to extract text from PDF")

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        doc = Document(io.BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting DOCX text: {e}")
        raise HTTPException(status_code=400, detail="Unable to extract text from DOCX")

def analyze_grammar(text: str) -> Dict:
    """Analyze grammar and language quality using NLTK"""
    sentences = sent_tokenize(text)
    
    # Count potential grammar issues
    issues = []
    sentence_lengths = []
    
    for sentence in sentences:
        words = word_tokenize(sentence)
        sentence_lengths.append(len(words))
        
        # Check for very long sentences (>30 words)
        if len(words) > 30:
            issues.append("Long sentence detected")
        
        # Check for incomplete sentences
        if len(words) < 3:
            issues.append("Short/incomplete sentence")
    
    # Calculate average sentence length
    avg_sentence_length = np.mean(sentence_lengths) if sentence_lengths else 0
    
    # Score based on issues found
    grammar_score = max(0, 100 - len(issues) * 10)
    
    suggestions = []
    if avg_sentence_length > 25:
        suggestions.append("Consider breaking down long sentences for better readability.")
    if len(issues) > 5:
        suggestions.append("Multiple grammar issues detected. Consider proofreading.")
    if not suggestions:
        suggestions.append("Grammar appears to be in good shape!")
    
    return {
        'score': min(100, grammar_score),
        'suggestion': ' '.join(suggestions)
    }

def analyze_readability(text: str) -> Dict:
    """Analyze text readability using textstat"""
    try:
        # Calculate various readability scores
        flesch_score = textstat.flesch_reading_ease(text)
        flesch_kincaid = textstat.flesch_kincaid_grade(text)
        
        # Convert Flesch score to our 0-100 scale
        if flesch_score >= 90:
            readability_score = 100
        elif flesch_score >= 80:
            readability_score = 90
        elif flesch_score >= 70:
            readability_score = 80
        elif flesch_score >= 60:
            readability_score = 70
        elif flesch_score >= 50:
            readability_score = 60
        else:
            readability_score = max(0, 50 + flesch_score)
        
        suggestion = ""
        if flesch_score < 50:
            suggestion = "Text is quite complex. Try using shorter sentences and simpler words."
        elif flesch_score < 70:
            suggestion = "Moderate readability. Consider simplifying some complex sentences."
        else:
            suggestion = "Good readability level for professional documents."
            
        return {
            'score': int(readability_score),
            'suggestion': suggestion
        }
    except:
        return {
            'score': 70,
            'suggestion': "Unable to calculate readability score. Ensure text has sufficient content."
        }

def analyze_keywords(text: str) -> Dict:
    """Analyze keyword usage and industry relevance"""
    text_lower = text.lower()
    
    # Count industry keywords
    all_keywords = []
    for keywords in INDUSTRY_KEYWORDS.values():
        all_keywords.extend(keywords)
    
    found_keywords = [kw for kw in all_keywords if kw in text_lower]
    action_verbs_found = [verb for verb in ACTION_VERBS if verb in text_lower]
    
    # Calculate keyword density
    total_words = len(text.split())
    keyword_density = (len(found_keywords) + len(action_verbs_found)) / max(total_words, 1) * 100
    
    # Score based on keyword presence and density
    keyword_score = min(100, (len(found_keywords) * 5) + (len(action_verbs_found) * 3) + (keyword_density * 2))
    
    suggestions = []
    if len(found_keywords) < 5:
        suggestions.append("Add more industry-specific keywords relevant to your field.")
    if len(action_verbs_found) < 8:
        suggestions.append("Use more action verbs to describe your achievements.")
    if keyword_density < 2:
        suggestions.append("Increase keyword density by including more relevant technical terms.")
    if not suggestions:
        suggestions.append("Good keyword usage! Your resume should perform well with ATS systems.")
    
    return {
        'score': int(keyword_score),
        'suggestion': ' '.join(suggestions)
    }

def analyze_structure(text: str) -> Dict:
    """Analyze resume structure and formatting"""
    lines = text.split('\n')
    non_empty_lines = [line for line in lines if line.strip()]
    
    # Check for common resume sections
    sections = ['experience', 'education', 'skills', 'summary', 'objective', 'projects']
    found_sections = []
    
    for line in non_empty_lines:
        line_lower = line.lower()
        for section in sections:
            if section in line_lower:
                found_sections.append(section)
    
    # Check for bullet points
    bullet_points = sum(1 for line in non_empty_lines if line.strip().startswith(('•', '-', '*', '→')))
    
    # Check for contact information patterns
    has_email = bool(re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text))
    has_phone = bool(re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text))
    
    # Calculate structure score
    structure_score = 0
    structure_score += len(set(found_sections)) * 15  # Points for each unique section
    structure_score += min(20, bullet_points * 2)     # Points for bullet points
    structure_score += 10 if has_email else 0         # Email present
    structure_score += 10 if has_phone else 0         # Phone present
    structure_score += 10 if len(non_empty_lines) > 10 else 0  # Sufficient content
    
    suggestions = []
    if len(set(found_sections)) < 3:
        suggestions.append("Include key sections: Summary/Objective, Experience, Education, and Skills.")
    if bullet_points < 5:
        suggestions.append("Use bullet points to organize information and improve readability.")
    if not has_email:
        suggestions.append("Make sure to include your email address.")
    if not has_phone:
        suggestions.append("Include your phone number for easy contact.")
    if not suggestions:
        suggestions.append("Good structure! Your resume is well-organized.")
    
    return {
        'score': min(100, structure_score),
        'suggestion': ' '.join(suggestions)
    }

def calculate_overall_score(breakdown: Dict[str, int]) -> int:
    """Calculate weighted overall score"""
    weights = {
        'grammar': 0.25,
        'readability': 0.25,
        'keywords': 0.25,
        'structure': 0.25
    }
    
    overall = sum(breakdown[category] * weights[category] for category in breakdown)
    return int(round(overall))

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "ResumeScore API is running!", "status": "healthy"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume_text(request: ResumeTextRequest):
    """Analyze resume text and return scores with suggestions"""
    try:
        text = request.text.strip()
        
        if not text:
            raise HTTPException(status_code=400, detail="Resume text cannot be empty")
        
        if len(text) < 100:
            raise HTTPException(status_code=400, detail="Resume text too short for meaningful analysis")
        
        # Perform analysis
        grammar_result = analyze_grammar(text)
        readability_result = analyze_readability(text)
        keywords_result = analyze_keywords(text)
        structure_result = analyze_structure(text)
        
        # Prepare response
        breakdown = {
            'grammar': grammar_result['score'],
            'readability': readability_result['score'],
            'keywords': keywords_result['score'],
            'structure': structure_result['score']
        }
        
        suggestions = {
            'grammar': grammar_result['suggestion'],
            'readability': readability_result['suggestion'],
            'keywords': keywords_result['suggestion'],
            'structure': structure_result['suggestion']
        }
        
        overall_score = calculate_overall_score(breakdown)
        
        logger.info(f"Analysis completed. Overall score: {overall_score}")
        
        return AnalysisResponse(
            overall_score=overall_score,
            breakdown=breakdown,
            suggestions=suggestions
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during analysis")

@app.post("/analyze/file", response_model=AnalysisResponse)
async def analyze_resume_file(file: UploadFile = File(...)):
    """Analyze uploaded resume file"""
    try:
        # Check file type
        if not file.content_type:
            raise HTTPException(status_code=400, detail="Unable to determine file type")
        
        # Read file content
        file_content = await file.read()
        
        # Extract text based on file type
        if file.content_type == "application/pdf":
            text = extract_text_from_pdf(file_content)
        elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            text = extract_text_from_docx(file_content)
        elif file.content_type == "text/plain":
            text = file_content.decode('utf-8')
        else:
            raise HTTPException(
                status_code=400, 
                detail="Unsupported file type. Please upload PDF, DOCX, or TXT files."
            )
        
        if not text or len(text.strip()) < 100:
            raise HTTPException(
                status_code=400, 
                detail="Unable to extract sufficient text from file for analysis"
            )
        
        # Analyze the extracted text
        return await analyze_resume_text(ResumeTextRequest(text=text))
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"File analysis error: {e}")
        raise HTTPException(status_code=500, detail="Error processing file")

@app.get("/health")
async def health_check():
    """Detailed health check"""
    try:
        # Test NLTK tokenizer with fallback
        nltk_status = "unknown"
        try:
            test_tokens = word_tokenize("This is a test sentence.")
            nltk_status = "loaded" if test_tokens else "error"
        except Exception as nltk_e:
            nltk_status = f"error: {str(nltk_e)}"
        
        # Test textstat
        textstat_status = "available"
        try:
            textstat.flesch_reading_ease("test")
        except Exception:
            textstat_status = "error"
        
        return {
            "status": "healthy",
            "nltk_tokenizer": nltk_status,
            "textstat": textstat_status,
            "version": "1.0.0",
            "port": os.environ.get("PORT", "8000")
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={"status": "unhealthy", "error": str(e)}
        )

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=False)