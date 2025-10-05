'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RetroGrid from '@/components/RetroGrid';
import { ArrowLeft, Brain, Shield, Zap, Users, Target, Code } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen relative">
      <RetroGrid />
      
      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center p-6">
        <Link href="/" className="flex items-center text-white hover:text-neon-cyan transition-colors">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
        <Link href="/analyze" className="text-white hover:text-neon-cyan transition-colors">
          Analyze Resume
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
          <div className="text-center mb-16">
            <h1 className="font-orbitron text-4xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-neon-pink">ResumeScore</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              AI-powered resume analysis that helps you land your dream job. 
              Our advanced algorithms analyze your resume across multiple dimensions 
              to provide actionable insights and improvement suggestions.
            </p>
          </div>
          
          {/* How It Works */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="font-orbitron text-3xl font-bold text-white text-center mb-12">
              How Our AI Analysis Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analysisFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="h-full text-center hover:neon-glow transition-all duration-300">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full bg-neon-gradient flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-300">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
          
          {/* Technology Stack */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-3">
                  <Code className="h-6 w-6" />
                  Powered by Advanced Technology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <h3 className="font-orbitron text-xl font-bold text-neon-pink mb-3">
                      Natural Language Processing
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Using spaCy for advanced grammar checking, entity recognition, 
                      and linguistic analysis to ensure your resume is error-free.
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-orbitron text-xl font-bold text-neon-cyan mb-3">
                      Readability Analysis
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Leveraging textstat algorithms to measure readability scores 
                      and ensure your resume is clear and professional.
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-orbitron text-xl font-bold text-neon-pink mb-3">
                      Keyword Optimization
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Industry-specific keyword analysis to help your resume 
                      pass ATS systems and catch recruiter attention.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
          
          {/* Scoring Methodology */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="font-orbitron text-3xl font-bold text-white text-center mb-12">
              Our Scoring Methodology
            </h2>
            
            <div className="grid gap-6">
              {scoringCriteria.map((criterion, index) => (
                <motion.div
                  key={criterion.category}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-neon-gradient flex items-center justify-center flex-shrink-0">
                          <criterion.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-orbitron text-xl font-bold text-neon-pink mb-2">
                            {criterion.category}
                          </h3>
                          <p className="text-gray-300 mb-3">
                            {criterion.description}
                          </p>
                          <div className="text-sm text-neon-cyan">
                            <strong>Weight:</strong> {criterion.weight} | <strong>Factors:</strong> {criterion.factors}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
          
          {/* Ethics & Privacy */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="border-neon-pink/30">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-3">
                  <Shield className="h-6 w-6 text-neon-pink" />
                  Privacy & Ethics Commitment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-300">
                  <p>
                    <strong className="text-white">Data Privacy:</strong> Your resume data is processed securely and is not stored 
                    permanently on our servers. All analysis is performed in real-time and results are temporarily 
                    cached only for your session.
                  </p>
                  <p>
                    <strong className="text-white">Bias-Free Analysis:</strong> Our AI algorithms are designed to be objective 
                    and focus solely on content quality, structure, and technical aspects without considering 
                    personal information, demographics, or background.
                  </p>
                  <p>
                    <strong className="text-white">Educational Purpose:</strong> ResumeScore is an educational tool designed 
                    to provide insights and suggestions. Final hiring decisions should always consider the full 
                    picture of a candidate&#39;s qualifications and potential.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>
          
          {/* Call to Action */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <h2 className="font-orbitron text-3xl font-bold text-white mb-6">
              Ready to Improve Your Resume?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get started with our AI-powered analysis and take the first step 
              towards landing your dream job.
            </p>
            <Link href="/analyze">
              <Button variant="neon" size="lg" className="px-12 py-4 text-lg">
                <Brain className="mr-2 h-6 w-6" />
                Analyze My Resume Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

const analysisFeatures = [
  {
    icon: Brain,
    title: 'Grammar Analysis',
    description: 'Advanced NLP algorithms detect grammar errors, sentence structure issues, and writing inconsistencies.',
  },
  {
    icon: Target,
    title: 'Readability Score',
    description: 'Measures text complexity and readability to ensure your resume is clear and professional.',
  },
  {
    icon: Zap,
    title: 'Keyword Optimization',
    description: 'Identifies missing industry keywords and suggests improvements for ATS compatibility.',
  },
  {
    icon: Users,
    title: 'Structure Review',
    description: 'Evaluates formatting, organization, and professional presentation standards.',
  },
];

const scoringCriteria = [
  {
    category: 'Grammar & Language (25%)',
    description: 'Evaluates spelling, grammar, sentence structure, and overall language quality using advanced NLP techniques.',
    weight: '25%',
    factors: 'Spelling errors, grammar mistakes, sentence complexity, word choice',
    icon: Brain,
  },
  {
    category: 'Readability (25%)',
    description: 'Measures how easy your resume is to read and understand, ensuring it\'s accessible to recruiters.',
    weight: '25%',
    factors: 'Flesch-Kincaid score, sentence length, paragraph structure, clarity',
    icon: Target,
  },
  {
    category: 'Keywords (25%)',
    description: 'Analyzes industry-relevant keywords and technical terms that help your resume pass ATS systems.',
    weight: '25%',
    factors: 'Industry keywords, technical skills, action verbs, relevance',
    icon: Zap,
  },
  {
    category: 'Structure & Format (25%)',
    description: 'Reviews professional formatting, organization, and presentation standards for maximum impact.',
    weight: '25%',
    factors: 'Section organization, bullet points, formatting consistency, length',
    icon: Users,
  },
];