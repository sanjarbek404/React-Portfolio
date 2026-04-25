
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations as defaultTranslations } from './translations';
import { db, isFirebaseConfigured } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

type Language = 'UZ' | 'RU' | 'EN';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
  updateTranslations?: (newTranslation: any) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Deep merge helper
function mergeDeep(target: any, source: any) {
  if (typeof target !== 'object' || target === null) return source;
  if (typeof source !== 'object' || source === null) return target;

  const output = Object.assign({}, target);
  Object.keys(source).forEach(key => {
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      if (!(key in target)) Object.assign(output, { [key]: source[key] });
      else output[key] = mergeDeep(target[key], source[key]);
    } else {
      Object.assign(output, { [key]: source[key] });
    }
  });
  return output;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved as Language) || 'UZ';
  });

  const [dbTranslations, setDbTranslations] = useState<any>({});

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const unsub = onSnapshot(doc(db, 'settings', 'translations'), (docSnap) => {
        if (docSnap.exists() && docSnap.data().data) {
          try {
             let parsed = docSnap.data().data;
             if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
             }
             setDbTranslations(parsed);
          } catch(e) {}
        }
      });
      return () => unsub();
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const mergedTranslations = mergeDeep(defaultTranslations, dbTranslations);
  const t = mergedTranslations[lang] || defaultTranslations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
