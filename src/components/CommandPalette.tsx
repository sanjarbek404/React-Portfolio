import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, ExternalLink, Moon, Sun, Lock, FileText, Briefcase, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function CommandPalette({ isDark, toggleDark, t }: { isDark: boolean, toggleDark: () => void, t: any }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#111111] rounded-2xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10"
          >
            <Command className="w-full">
              <div className="flex items-center px-4 py-3 border-b border-black/5 dark:border-white/5 relative">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <Command.Input 
                  autoFocus
                  placeholder="Nima qidiryapsiz? (Masalan: /cv, mavzu)" 
                  className="flex-1 px-4 bg-transparent outline-none text-[#1d1d1f] dark:text-white placeholder:text-gray-400 py-1"
                />
                <button onClick={() => setOpen(false)} className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-500 font-medium">ESC</button>
              </div>

              <Command.List className="max-h-[350px] overflow-y-auto p-2">
                <Command.Empty className="py-10 text-center text-sm text-gray-500">Hech narsa topilmadi.</Command.Empty>

                <Command.Group heading="Sahifalar" className="px-2 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  <Command.Item onSelect={() => handleSelect(() => navigate('/'))} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#1d1d1f] dark:text-white aria-selected:bg-blue-500/10 aria-selected:text-blue-500 mb-1 transition-colors">
                    <Briefcase className="w-4 h-4" /> Asosiy Portfolio
                  </Command.Item>
                  <Command.Item onSelect={() => handleSelect(() => navigate('/cv-builder'))} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#1d1d1f] dark:text-white aria-selected:bg-blue-500/10 aria-selected:text-blue-500 mb-1 transition-colors">
                    <FileText className="w-4 h-4" /> {t?.nav?.cv || "CV Builder"}
                  </Command.Item>
                  <Command.Item onSelect={() => handleSelect(() => navigate('/admin'))} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#1d1d1f] dark:text-white aria-selected:bg-blue-500/10 aria-selected:text-blue-500 mb-1 transition-colors">
                    <Lock className="w-4 h-4" /> Admin Panel
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Harakatlar" className="px-2 py-2 mt-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  <Command.Item onSelect={() => handleSelect(toggleDark)} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#1d1d1f] dark:text-white aria-selected:bg-blue-500/10 aria-selected:text-blue-500 mb-1 transition-colors">
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    Mavzuni {isDark ? 'Yoritish' : 'Qoraytirish'}
                  </Command.Item>
                  <Command.Item onSelect={() => handleSelect(() => { navigate('/'); setTimeout(() => window.location.hash = '#projects', 100); })} className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[#1d1d1f] dark:text-white aria-selected:bg-blue-500/10 aria-selected:text-blue-500 mb-1 transition-colors">
                    <Award className="w-4 h-4" /> Loyihalarga o'tish
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
