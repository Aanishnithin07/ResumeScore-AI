import pytest
import asyncio
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "version" in data

def test_analyze_text_endpoint():
    """Test text analysis endpoint"""
    test_resume = """
    John Doe
    Software Engineer
    john.doe@email.com
    (555) 123-4567
    
    EXPERIENCE
    • Developed and maintained Python applications using Django and Flask frameworks
    • Implemented RESTful APIs and integrated third-party services
    • Collaborated with cross-functional teams in an Agile environment
    • Managed database operations using PostgreSQL and MongoDB
    
    EDUCATION
    Bachelor of Science in Computer Science
    University of Technology, 2020
    
    SKILLS
    • Python, JavaScript, React, Node.js
    • SQL, PostgreSQL, MongoDB
    • Git, Docker, AWS
    • Agile, Scrum, Test-Driven Development
    """
    
    response = client.post("/analyze", json={"text": test_resume})
    assert response.status_code == 200
    
    data = response.json()
    assert "overall_score" in data
    assert "breakdown" in data
    assert "suggestions" in data
    
    # Check that all categories are present
    breakdown = data["breakdown"]
    assert "grammar" in breakdown
    assert "readability" in breakdown
    assert "keywords" in breakdown
    assert "structure" in breakdown
    
    # Check score ranges
    assert 0 <= data["overall_score"] <= 100
    for category, score in breakdown.items():
        assert 0 <= score <= 100

def test_analyze_empty_text():
    """Test analysis with empty text"""
    response = client.post("/analyze", json={"text": ""})
    assert response.status_code == 400

def test_analyze_short_text():
    """Test analysis with very short text"""
    response = client.post("/analyze", json={"text": "Short text"})
    assert response.status_code == 400

def test_analyze_file_endpoint_unsupported_type():
    """Test file analysis with unsupported file type"""
    # Create a mock file with unsupported content type
    files = {"file": ("test.xyz", b"some content", "application/xyz")}
    response = client.post("/analyze/file", files=files)
    assert response.status_code == 400

if __name__ == "__main__":
    pytest.main([__file__])