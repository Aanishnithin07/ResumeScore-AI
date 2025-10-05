import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AnalysisResult {
  overall_score: number;
  breakdown: {
    grammar: number;
    readability: number;
    keywords: number;
    structure: number;
  };
  suggestions: {
    grammar: string;
    readability: string;
    keywords: string;
    structure: string;
  };
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeResume = async (text: string): Promise<AnalysisResult> => {
  try {
    const response = await api.post('/analyze', { text });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to analyze resume. Please try again.');
  }
};

export const analyzeResumeFile = async (file: File): Promise<AnalysisResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/analyze/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to analyze resume file. Please try again.');
  }
};