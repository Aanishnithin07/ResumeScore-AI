'use client';

import React from 'react';
import { motion } from 'framer-motion';

const RetroGrid: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <motion.div
        className="retro-grid absolute inset-0"
        animate={{ 
          backgroundPosition: ['0px 0px', '50px 50px'] 
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 via-transparent to-neon-cyan/10" />
    </div>
  );
};

export default RetroGrid;