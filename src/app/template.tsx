'use client';

import { motion } from 'framer-motion';
import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const variants = {
    hidden: { opacity: 0, x: 100 },
    enter: { opacity: 1, x: 0 },
  };

  return (
    <motion.main
      data-scroll
      initial="hidden"
      animate="enter"
      variants={variants}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.main>
  );
}
