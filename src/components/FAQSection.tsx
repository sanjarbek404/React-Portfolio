import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

const faqs = [
  {
    kuz: "Siz qanday texnologiyalar bilan ishlaysiz?",
    en: "What technologies do you work with?",
    ruz: "Men asosan React, TypeScript, Node.js, Tailwind CSS va Firebase bilan ishlayman. Shuningdek, loyiha talabiga ko'ra boshqa zamonaviy vositalarni ham o'zlashtirib keta olaman.",
    ren: "I mainly work with React, TypeScript, Node.js, Tailwind CSS, and Firebase. I can also adapt to other modern tools depending on the project requirements."
  },
  {
    kuz: "Bitta loyiha qancha vaqt oladi?",
    en: "How long does a project take?",
    ruz: "Loyihaning hajmi va murakkabligiga qarab 1 haftadan 2 oygacha vaqt olishi mumkin. Aniq vaqtni loyiha talablarini muhokama qilgandan so'ng aytishim mumkin.",
    ren: "Depending on the size and complexity of the project, it can take anywhere from 1 week to 2 months. I can provide an exact timeline after discussing the project requirements."
  },
  {
    kuz: "Loyiha tugagandan keyin qo'llab-quvvatlaysizmi?",
    en: "Do you provide support after the project is finished?",
    ruz: "Ha, albatta. Loyiha topshirilgandan keyin ham texnik xizmat ko'rsatish va yangilanishlar bo'yicha kelishuv asosida yordam berishda davom etaman.",
    ren: "Yes, definitely. I continue to provide technical support and updates based on an agreement even after the project is delivered."
  },
  {
    kuz: "To'lovlar qanday amalga oshiriladi?",
    en: "How are payments handled?",
    ruz: "Odatda to'lov 2 yoki 3 qismga bo'linadi: 30-50% oldindan to'lov loyiha boshlanishidan oldin, qolgan qismi esa loyiha topshirilganda to'lanadi.",
    ren: "Usually, payment is divided into 2 or 3 parts: a 30-50% upfront payment before the project starts, and the rest when the project is delivered."
  }
];

export const FAQSection = () => {
  const { lang } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const t = {
    UZ: {
      title: "Ko'p beriladigan ",
      highlight: "Savollar",
      subtitle: "Mijozlar tomonidan doimiy so'raladigan savollar va ularning javoblari"
    },
    RU: {
      title: "Часто задаваемые ",
      highlight: "Вопросы",
      subtitle: "Ответы на часто задаваемые вопросы клиентов"
    },
    EN: {
      title: "Frequently Asked ",
      highlight: "Questions",
      subtitle: "Commonly asked questions by clients and their answers"
    }
  }[lang] || { title: '', highlight: '', subtitle: '' };

  return (
    <section className="py-20 md:py-32 relative z-10" id="faq">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <MessageCircleQuestion size={32} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1d1d1f] dark:text-white tracking-tight mb-6"
          >
            {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{t.highlight}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            {t.subtitle}
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const question = lang === 'UZ' ? faq.kuz : faq.en;
            const answer = lang === 'UZ' ? faq.ruz : faq.ren;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={`bg-white/80 dark:bg-[#111]/80 backdrop-blur-md rounded-2xl md:rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer ${isOpen ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10'}`}
              >
                <div className="p-6 md:p-8 flex justify-between items-center gap-4">
                  <h3 className={`text-lg md:text-xl font-bold transition-colors ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-[#1d1d1f] dark:text-white'}`}>
                    {question}
                  </h3>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${isOpen ? 'bg-blue-500 text-white rotate-180' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                    <ChevronDown size={20} />
                  </div>
                </div>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                        <div className="h-px w-full bg-black/5 dark:bg-white/5 mb-6" />
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                          {answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
