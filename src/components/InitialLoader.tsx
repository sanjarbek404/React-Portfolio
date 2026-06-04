import React from 'react';
import { motion } from 'motion/react';

export const InitialLoader = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[99999] bg-[#f4f7fe] dark:bg-[#050505] flex items-center justify-center overflow-hidden origin-center"
    >
      {/* Background gradients */}
      <motion.div 
        exit={{ opacity: 0 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" 
      />
      <motion.div 
        exit={{ opacity: 0 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '0.5s' }} 
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center"
      >
        <div className="relative">
          {/* S Logo with glow */}
          <motion.div 
            initial={{ rotateY: -90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-white text-6xl md:text-7xl font-display font-black shadow-[0_0_40px_rgba(59,130,246,0.4)] md:shadow-[0_0_60px_rgba(59,130,246,0.4)] relative z-10"
          >
            S
          </motion.div>
          {/* Spinning rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 md:-inset-6 border-[3px] border-transparent border-t-blue-500 border-r-cyan-400 rounded-full opacity-60"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 md:-inset-10 border-[2px] border-transparent border-b-blue-400 border-l-cyan-300 rounded-full opacity-40"
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16 flex items-center gap-2"
        >
          <div className="flex gap-1.5 px-6 py-2.5 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full border border-black/5 dark:border-white/10 shadow-lg">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                className="w-2.5 h-2.5 rounded-full bg-blue-500"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
