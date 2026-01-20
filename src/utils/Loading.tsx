import React from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  const dotVariants = {
    initial: { y: 0, scale: 1 },
    animate: { y: [-10, 10, -10], scale: [1, 1.3, 1] }, // bigger bounce
  };

  return (
    <motion.div
      className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Optional spinning ring */}
      <motion.div
        className='absolute w-32 h-32 border-4 rounded-full border-t-blue-500 border-b-purple-500 border-l-pink-500 border-r-transparent'
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
      />

      {/* Bouncing gradient dots */}
      <div className='relative flex items-center gap-4 mb-8'>
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className='rounded-full shadow-lg w-7 h-7 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 shadow-pink-500/50'
            variants={dotVariants}
            animate='animate'
            transition={{
              repeat: Infinity,
              duration: 0.6,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Loading text */}
      <motion.p
        className='text-2xl font-extrabold text-white drop-shadow-lg'
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};
