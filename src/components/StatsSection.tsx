import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { Code2, Users, Coffee, Rocket } from 'lucide-react';

export const StatsSection = () => {
  const { lang, t } = useLanguage();
  
  const defaultIcons = [
    <Rocket size={24} />,
    <Users size={24} />,
    <Code2 size={24} />,
    <Coffee size={24} />
  ];

  // Try to use t.statsCards if available, otherwise fallback to empty array
  const currentStats = t?.statsCards || [];

  if (currentStats.length === 0) return null;

  return (
    <section className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {currentStats.map((stat: any, i: number) => {
            const icon = defaultIcons[i % defaultIcons.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center border border-black/5 dark:border-white/5 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <div className="text-3xl md:text-5xl font-black text-[#1d1d1f] dark:text-white tracking-tight mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                  {stat.text}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
