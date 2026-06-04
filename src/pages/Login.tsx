import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft, Terminal } from 'lucide-react';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;
    
    // Redirect if already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/admin');
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const getSystemInfo = () => {
    const ua = navigator.userAgent;
    let browser = "Unknown Browser";
    let os = "Unknown OS";
    
    if (ua.match(/chrome|chromium|crios/i)) browser = "Chrome";
    else if (ua.match(/firefox|fxios/i)) browser = "Firefox";
    else if (ua.match(/safari/i)) browser = "Safari";
    else if (ua.match(/opr\//i)) browser = "Opera";
    else if (ua.match(/edg/i)) browser = "Edge";
    
    if (ua.match(/windows nt/i)) os = "Windows";
    else if (ua.match(/macintosh|mac os x/i)) os = "macOS";
    else if (ua.match(/linux/i)) os = "Linux";
    else if (ua.match(/iphone|ipad|ipod/i)) os = "iOS";
    else if (ua.match(/android/i)) os = "Android";
    
    return { browser, os };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFirebaseConfigured || !auth || !db) {
      toast.error("Firebase ulanmagan! Iltimos, .env faylni tekshiring.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Tizimga kirilmoqda...");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store session
      const sessionId = crypto.randomUUID();
      localStorage.setItem('adminSessionId', sessionId);
      
      const { browser, os } = getSystemInfo();
      
      await setDoc(doc(db, 'sessions', sessionId), {
        userId: user.uid,
        email: user.email,
        browser,
        os,
        userAgent: navigator.userAgent,
        loginTime: serverTimestamp(),
        lastActive: serverTimestamp()
      });

      toast.success("Muvaffaqiyatli kirdingiz!", { id: toastId });
      navigate('/admin');
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Email yoki parol noto'g'ri!", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#050505]"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
      
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors z-20 bg-white/5 py-2 px-4 rounded-full border border-white/10 backdrop-blur-md hover:bg-white/10"
      >
        <ArrowLeft size={16} />
        <span className="text-sm">Saytga qaytish</span>
      </Link>

      <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-[#0a0a0a] rounded-[2rem] p-10 shadow-2xl border border-white/10 relative z-10 backdrop-blur-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-6 shadow-inner border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl group-hover:bg-blue-500/30 transition-colors duration-500"></div>
            <Terminal size={28} className="relative z-10" />
          </div>
          <h1 className="text-3xl font-display font-medium tracking-tight text-white mb-2">Workspace</h1>
          <p className="text-sm text-gray-400">Markaziy boshqaruv tizimi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-sm" 
                placeholder="Elektron pochta"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-sm" 
                placeholder="Parol"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 mt-6 shadow-lg shadow-white/5"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                Tizimga kirish
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
