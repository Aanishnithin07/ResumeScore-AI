'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Heart } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="relative z-20 mt-20 py-8 border-t border-neon-cyan/20 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Logo size="sm" showText={true} />
          </motion.div>

          {/* Developer Credit */}
          <motion.div
            className="flex items-center space-x-2 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gray-300">Developed with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span className="text-gray-300">by</span>
            <a
              href="https://www.linkedin.com/in/aanishnithin07"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:text-neon-pink transition-colors duration-300 font-semibold flex items-center space-x-1 group"
            >
              <span>Aanish Nithin A</span>
              <Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </a>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-gray-400 text-sm">Send feedback:</span>
            <a
              href="mailto:aanishnithin07@gmail.com"
              className="text-neon-cyan hover:text-neon-pink transition-colors duration-300 text-sm flex items-center space-x-1 group"
            >
              <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>aanishnithin07@gmail.com</span>
            </a>
          </motion.div>

          {/* Copyright */}
          <motion.div
            className="text-gray-400 text-sm text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            © 2025 ResumeScore. All rights reserved.
          </motion.div>
        </div>
      </div>
    </footer>
  );
}