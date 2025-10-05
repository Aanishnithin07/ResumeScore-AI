'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RetroGrid from '@/components/RetroGrid';
import Logo from '@/components/Logo';
import { Sparkles, Zap, Target, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <RetroGrid />
      
      {/* CRT Lines Effect */}
      <div className="crt-lines absolute inset-0 pointer-events-none z-10" />
      
      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center p-6">
        <Link href="/">
          <Logo size="md" showText={true} />
        </Link>
        
        <motion.div
          className="flex space-x-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/about" className="text-white hover:text-neon-cyan transition-colors">
            About
          </Link>
          <Link href="/analyze" className="text-white hover:text-neon-cyan transition-colors">
            Analyze
          </Link>
        </motion.div>
      </nav>
      
      {/* Hero Section */}
      <main className="relative z-20 container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            className="font-orbitron text-6xl md:text-8xl font-black text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Get Your Resume Score
            <span className="text-transparent bg-neon-gradient bg-clip-text animate-glow-pulse">
              {' '}Instantly
            </span>
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Powered by advanced AI and NLP analysis. Get detailed feedback on grammar, 
            readability, keywords, and structure to land your dream job.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link href="/analyze">
              <Button variant="neon" size="lg" className="px-8 py-4 text-lg">
                <Zap className="mr-2 h-5 w-5" />
                Analyze My Resume
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
        
        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
            >
              <Card className="h-full hover:neon-glow transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-full bg-neon-gradient flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
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
        </motion.div>
        
        {/* Floating Mascot */}
        <motion.div
          className="fixed bottom-24 right-8 z-30"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-16 h-16 rounded-full bg-neon-gradient flex items-center justify-center neon-glow">
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          </div>
        </motion.div>
      </main>
    </div>
  );
}

const features = [
  {
    icon: Target,
    title: 'Grammar Analysis',
    description: 'AI-powered grammar and syntax checking to ensure your resume is error-free.',
  },
  {
    icon: Sparkles,
    title: 'Readability Score',
    description: 'Optimize your resume for maximum readability and impact.',
  },
  {
    icon: Zap,
    title: 'Keyword Optimization',
    description: 'Industry-specific keyword analysis to beat ATS systems.',
  },
  {
    icon: Award,
    title: 'Structure Review',
    description: 'Professional formatting and structure recommendations.',
  },
];