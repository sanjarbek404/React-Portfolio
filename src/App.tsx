/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'motion/react';
import { LanguageProvider } from './lib/LanguageContext';
import { GoogleAnalytics } from './components/GoogleAnalytics';
import { CustomCursor } from './components/CustomCursor';
import { InitialLoader } from './components/InitialLoader';

const Portfolio = lazy(() => import('./pages/Portfolio'));
const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));
const CVBuilder = lazy(() => import('./pages/CVBuilder'));

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // 1200ms ensures it's shown cleanly even on fast loading
    const timer = setTimeout(() => setShowSplash(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LanguageProvider>
      <CustomCursor />
      <Router>
        <GoogleAnalytics />
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#1d1d1f',
              color: '#fff',
              borderRadius: '16px',
              padding: '16px 24px',
              fontSize: '14px',
              fontWeight: '500'
            },
            success: {
              style: {
                background: '#22c55e',
              }
            },
            error: {
              style: {
                background: '#ef4444',
              }
            }
          }}
        />
        <AnimatePresence>
          {showSplash && <InitialLoader />}
        </AnimatePresence>
        <Suspense fallback={<div className="min-h-screen bg-[#f4f7fe] dark:bg-[#050505]" />}>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/cv-builder" element={<CVBuilder />} />
          </Routes>
        </Suspense>
      </Router>
    </LanguageProvider>
  );
}
