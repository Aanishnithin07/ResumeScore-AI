'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import RetroGrid from '@/components/RetroGrid';
import CircularProgress from '@/components/CircularProgress';
import { AnalysisResult } from '@/lib/api';
import { ArrowLeft, Download, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get analysis result from localStorage
    const stored = localStorage.getItem('resumeAnalysis');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setResult(parsed);
      } catch (error) {
        console.error('Failed to parse stored result:', error);
      }
    }
    setLoading(false);
  }, []);

  const generatePDFReport = () => {
    if (!result) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Title
    doc.setFontSize(24);
    doc.text('Resume Analysis Report', pageWidth / 2, 30, { align: 'center' });
    
    // Overall Score
    doc.setFontSize(18);
    doc.text(`Overall Score: ${result.overall_score}/100`, 20, 60);
    
    // Breakdown
    doc.setFontSize(14);
    let yPos = 80;
    doc.text('Category Breakdown:', 20, yPos);
    yPos += 20;
    
    Object.entries(result.breakdown).forEach(([category, score]) => {
      doc.text(`${category.charAt(0).toUpperCase() + category.slice(1)}: ${score}/100`, 30, yPos);
      yPos += 15;
    });
    
    // Suggestions
    yPos += 10;
    doc.text('Improvement Suggestions:', 20, yPos);
    yPos += 20;
    
    Object.entries(result.suggestions).forEach(([category, suggestion]) => {
      if (suggestion && suggestion.trim()) {
        doc.text(`${category.charAt(0).toUpperCase() + category.slice(1)}:`, 30, yPos);
        yPos += 10;
        const lines = doc.splitTextToSize(suggestion, pageWidth - 50);
        doc.text(lines, 35, yPos);
        yPos += lines.length * 5 + 10;
      }
    });
    
    doc.save('resume-analysis-report.pdf');
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <RetroGrid />
        <div className="relative z-20 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-pink mx-auto mb-4"></div>
          <p className="text-white font-orbitron">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <RetroGrid />
        <div className="relative z-20 text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-neon-pink mx-auto mb-4" />
          <h1 className="font-orbitron text-2xl text-white mb-4">No Results Found</h1>
          <p className="text-gray-300 mb-6">
            We couldn&apos;t find any analysis results. Please analyze your resume first.
          </p>
          <Link href="/analyze">
            <Button variant="neon">Analyze Resume</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-400" />;
    if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
    return <AlertTriangle className="h-5 w-5 text-red-400" />;
  };

  return (
    <div className="min-h-screen relative">
      <RetroGrid />
      
      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center p-6">
        <Link href="/analyze" className="flex items-center text-white hover:text-neon-cyan transition-colors">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Analyze Another
        </Link>
        <div className="flex space-x-4">
          <Button onClick={generatePDFReport} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <Link href="/analyze">
            <Button variant="ghost" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </Link>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="relative z-20 container mx-auto px-6 py-12">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-white mb-4">
              Your Resume <span className="text-neon-pink">Score</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Here&apos;s your detailed analysis with actionable insights
            </p>
          </div>
          
          {/* Overall Score */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <CircularProgress score={result.overall_score} size={250} />
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <h2 className="font-orbitron text-2xl text-white mb-2">Overall Score</h2>
              <p className="text-gray-300 max-w-md mx-auto">
                {result.overall_score >= 80 ? "Excellent! Your resume is well-optimized." :
                 result.overall_score >= 60 ? "Good foundation, but there's room for improvement." :
                 "Several areas need attention to make your resume more effective."}
              </p>
            </motion.div>
          </motion.div>
          
          {/* Category Breakdown */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {Object.entries(result.breakdown).map(([category, score], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="capitalize flex items-center gap-2">
                        {getScoreIcon(score)}
                        {category}
                      </CardTitle>
                      <span className={`font-bold text-lg ${getScoreColor(score)}`}>
                        {score}/100
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={score} className="mb-4" />
                    <CardDescription className="text-gray-300">
                      {result.suggestions[category as keyof typeof result.suggestions] || 
                       "Good performance in this category."}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Detailed Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-center">Improvement Recommendations</CardTitle>
                <CardDescription className="text-center">
                  Follow these suggestions to enhance your resume&apos;s effectiveness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {Object.entries(result.suggestions).map(([category, suggestion], index) => (
                    suggestion && suggestion.trim() && (
                      <motion.div
                        key={category}
                        className="border-l-4 border-neon-pink/50 pl-4 py-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                      >
                        <h4 className="font-semibold text-neon-cyan capitalize mb-2">
                          {category} Enhancement
                        </h4>
                        <p className="text-gray-300 leading-relaxed">
                          {suggestion}
                        </p>
                      </motion.div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Link href="/analyze">
              <Button variant="neon" size="lg" className="px-8">
                <RefreshCw className="mr-2 h-5 w-5" />
                Analyze Another Resume
              </Button>
            </Link>
            <Button onClick={generatePDFReport} variant="outline" size="lg" className="px-8">
              <Download className="mr-2 h-5 w-5" />
              Download PDF Report
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}