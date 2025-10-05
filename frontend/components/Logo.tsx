'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-4xl' }
  };

  return (
    <motion.div
      className={`flex items-center space-x-3 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo Icon */}
      <div className="flex-shrink-0">
        <Image
          src="/favicon-32x32.png"
          alt="ResumeScore Logo"
          width={sizes[size].icon}
          height={sizes[size].icon}
          className="w-auto h-auto"
        />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className={`font-orbitron ${sizes[size].text} font-bold text-white`}>
          Resume<span className="text-neon-pink">Score</span>
        </div>
      )}
    </motion.div>
  );
}