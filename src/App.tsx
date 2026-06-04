/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './lib/LanguageContext';
import { GoogleAnalytics } from './components/GoogleAnalytics';
import { CustomCursor } from './components/CustomCursor';

const Portfolio = lazy(() => import('./pages/Portfolio'));
const Login = lazy(() => import('./pages/Login'));
const Admin = lazy(() => import('./pages/Admin'));
const CVBuilder = lazy(() => import('./pages/CVBuilder'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f4f7fe] dark:bg-[#050505]">
    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

export default function App() {
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
        <Suspense fallback={<LoadingFallback />}>
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
