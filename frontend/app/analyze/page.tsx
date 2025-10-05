'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import RetroGrid from '@/components/RetroGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import { analyzeResume, analyzeResumeFile } from '@/lib/api';
import { Upload, FileText, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AnalyzePage() {
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const router = useRouter();

  const handleTextAnalysis = async () => {
    if (!resumeText.trim()) {
      setError('Please enter your resume text');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await analyzeResume(resumeText);
      // Store result in localStorage for the results page
      localStorage.setItem('resumeAnalysis', JSON.stringify(result));
      router.push('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileAnalysis = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await analyzeResumeFile(file);
      localStorage.setItem('resumeAnalysis', JSON.stringify(result));
      router.push('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please select a PDF, DOCX, or TXT file');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <RetroGrid />
        <div className="relative z-20">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <RetroGrid />
      
      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center p-6">
        <Link href="/" className="flex items-center text-white hover:text-neon-cyan transition-colors">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
        <Link href="/about" className="text-white hover:text-neon-cyan transition-colors">
          About
        </Link>
      </nav>
      
      {/* Main Content */}
      <main className="relative z-20 container mx-auto px-6 py-12">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-white mb-4">
              Analyze Your <span className="text-neon-pink">Resume</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Upload your resume or paste the text below for instant AI-powered analysis
            </p>
          </div>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex space-x-4 mb-4">
                <Button
                  variant={activeTab === 'text' ? 'neon' : 'outline'}
                  onClick={() => setActiveTab('text')}
                  className="flex-1"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Paste Text
                </Button>
                <Button
                  variant={activeTab === 'file' ? 'neon' : 'outline'}
                  onClick={() => setActiveTab('file')}
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <motion.div
                  className="flex items-center p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="mr-2 h-5 w-5" />
                  {error}
                </motion.div>
              )}
              
              {activeTab === 'text' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Textarea
                    placeholder="Paste your resume text here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="min-h-[300px] resize-none"
                  />
                  <div className="text-right text-sm text-gray-400 mt-2">
                    {resumeText.length} characters
                  </div>
                  <Button
                    onClick={handleTextAnalysis}
                    className="w-full mt-4"
                    variant="neon"
                    size="lg"
                    disabled={!resumeText.trim()}
                  >
                    Analyze Resume Text
                  </Button>
                </motion.div>
              )}
              
              {activeTab === 'file' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-neon-pink/50 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-300 mb-4">
                      Drag and drop your resume file here, or click to browse
                    </p>
                    <Input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Choose File
                      </label>
                    </Button>
                    <p className="text-sm text-gray-400 mt-2">
                      Supported formats: PDF, DOCX, TXT
                    </p>
                  </div>
                  
                  {file && (
                    <motion.div
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-neon-cyan mr-3" />
                        <div>
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-sm text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setFile(null)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        Remove
                      </Button>
                    </motion.div>
                  )}
                  
                  <Button
                    onClick={handleFileAnalysis}
                    className="w-full"
                    variant="neon"
                    size="lg"
                    disabled={!file}
                  >
                    Analyze Resume File
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}