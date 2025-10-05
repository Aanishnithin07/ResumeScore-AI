'use client';

import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-32 h-32 mb-6">
        {/* Radar background */}
        <div className="absolute inset-0 rounded-full border-2 border-neon-pink/30 bg-neon-pink/5">
          <div className="absolute inset-4 rounded-full border border-neon-cyan/20" />
          <div className="absolute inset-8 rounded-full border border-neon-pink/20" />
        </div>
        
        {/* Scanning line */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent origin-left transform -translate-x-16" />
        </motion.div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-neon-cyan rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      
      <motion.div
        className="text-white font-orbitron text-lg mb-2"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Analyzing Resume
      </motion.div>
      
      <motion.div
        className="text-neon-cyan text-sm loading-dots"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Processing AI analysis
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;