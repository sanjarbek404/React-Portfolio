import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Github, LayoutDashboard, Laptop, Activity, FolderKanban, Settings, LogOut, Plus, Trash2, BarChart3, Users, Eye, UploadCloud, Upload, Image as ImageIcon, X, MessageSquare, Award, Code, Briefcase, MonitorSmartphone, Server, PenTool, GraduationCap, Globe, ExternalLink, Menu, ChevronDown, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, setDoc, getDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

const app = isFirebaseConfigured ? auth?.app : null;

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 "
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-white/10"
          >
            <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-2">{title}</h3>
            <p className="text-[#86868b] dark:text-gray-400 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                Bekor qilish
              </button>
              <button onClick={() => { onConfirm(); onClose(); }} className="px-5 py-2.5 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20">
                O'chirish
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SkeletonLoader = () => (
  <div className="w-full space-y-4 animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-white/5 rounded-2xl w-full"></div>
    <div className="h-6 bg-gray-200 dark:bg-white/5 rounded-full w-3/4"></div>
    <div className="h-4 bg-gray-200 dark:bg-white/5 rounded-full w-1/2"></div>
  </div>
);

const DeleteButton = ({ onConfirm, title, message, className, children }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        {children || <Trash2 size={18} />}
      </button>
      <ConfirmModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onConfirm={onConfirm} 
        title={title} 
        message={message} 
      />
    </>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [totals, setTotals] = useState({ views: 0, visitors: 0 });
  const [loading, setLoading] = useState(true);

  const [projectsCount, setProjectsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => setProjectsCount(snap.size));
    const unsubMessages = onSnapshot(collection(db, 'messages'), (snap) => setMessagesCount(snap.size));
    
    return () => { unsubProjects(); unsubMessages(); };
  }, []);


  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'analytics'), (snapshot) => {
      let totalViews = 0;
      let totalVisitors = 0;
      
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        totalViews += d.views || 0;
        totalVisitors += d.visitors || 0;
        
        const dateObj = new Date(doc.id);
        const name = dateObj.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
        
        return { 
          name, 
          views: d.views || 0, 
          visitors: d.visitors || 0, 
          fullDate: doc.id 
        };
      }).sort((a, b) => a.fullDate.localeCompare(b.fullDate));

      const last7Days = data.slice(-7);
      
      setStats(last7Days);
      setTotals({ views: totalViews, visitors: totalVisitors });
      setLoading(false);
    }, (error) => {
      console.warn("Analytics fetch error:", error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#1d1d1f] dark:text-white">Dashboard</h2>
          <p className="text-gray-500 mt-1.5 font-medium">Umumiy yig'ilgan statistika</p>
        </div>
        <Link 
          to="/"
          target="_blank"
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/20"
        >
          <ExternalLink size={18} />
          <span>Saytni ko'rish</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-colors"
        >
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Eye size={20} />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-semibold">Ko'rishlar</p>
            </div>
            <div className="px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-lg text-xs font-semibold text-gray-500 flex items-center gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              Bu oy <ChevronDown size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-4 relative z-10 mt-6">
            <h3 className="text-4xl font-black text-[#1d1d1f] dark:text-white">{totals.views}</h3>
            <div className="px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-bold rounded flex items-center gap-1">
              <ArrowUpRight size={14} /> +12.5%
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2 relative z-10">O'tgan oyga nisbatan o'sish</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-colors"
        >
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Users size={20} />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-semibold">Tashrifchilar</p>
            </div>
            <div className="px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-lg text-xs font-semibold text-gray-500 flex items-center gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              Bu oy <ChevronDown size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-4 relative z-10 mt-6">
            <h3 className="text-4xl font-black text-[#1d1d1f] dark:text-white">{totals.visitors}</h3>
            <div className="px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-bold rounded flex items-center gap-1">
              <ArrowUpRight size={14} /> +8.2%
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2 relative z-10">O'tgan oyga nisbatan o'sish</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors"
        >
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                <BarChart3 size={20} />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-semibold">Konversiya</p>
            </div>
            <div className="px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-lg text-xs font-semibold text-gray-500 flex items-center gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              Bu oy <ChevronDown size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-4 relative z-10 mt-6">
            <h3 className="text-4xl font-black text-[#1d1d1f] dark:text-white">+{(totals.views / (totals.visitors || 1)).toFixed(1)}</h3>
            <div className="px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-bold rounded flex items-center gap-1">
              <ArrowUpRight size={14} /> +2.4%
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2 relative z-10">Har bitta tashrifchiga mos</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-[#0a0a0a] p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white">Tashriflar statistikasi</h3>
          <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-lg text-sm font-semibold text-gray-500 flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            Haftalik <ChevronDown size={14} />
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-6 rounded-2xl text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-white/10 group-hover:scale-110 transition-transform duration-500"><FolderKanban size={100} /></div>
          <div className="relative z-10">
            <h4 className="text-white/80 font-medium mb-1">Jami Loyihalar</h4>
            <div className="text-4xl font-bold">{projectsCount}</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl text-white shadow-lg shadow-purple-500/20 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-white/10 group-hover:scale-110 transition-transform duration-500"><MessageSquare size={100} /></div>
          <div className="relative z-10">
            <h4 className="text-white/80 font-medium mb-1">Xabarlar</h4>
            <div className="text-4xl font-bold">{messagesCount}</div>
          </div>
        </div>
      </div>

        <div className="w-full h-[400px]">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-4">
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p>Yuklanmoqda...</p>
            </div>
          ) : stats.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <BarChart3 size={48} className="mb-4 opacity-20" />
              <p>Hali ma'lumot yo'q</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={stats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#86868b', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#86868b', fontSize: 12, fontWeight: 500 }} dx={-10} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', color: '#1d1d1f', fontWeight: 600 }}
                  itemStyle={{ color: '#1d1d1f', fontWeight: 600 }}
                  cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#64748b', paddingTop: '20px' }} />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" name="Ko'rishlar" />
                <Area type="monotone" dataKey="visitors" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" name="Tashrifchilar" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const AdminHeader = ({ title, subtitle, isAdding, onToggleAdd, addText = "Yangi qo'shish", icon: Icon }: any) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
    <div>
      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#1d1d1f] dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-sm">{title}</h2>
      {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-1.5 font-medium">{subtitle}</p>}
    </div>
    {onToggleAdd && (
      <button 
        onClick={onToggleAdd}
        className="flex items-center gap-2 px-6 py-2.5 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] rounded-xl font-bold transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 w-full md:w-auto justify-center"
      >
        {isAdding ? 'Bekor qilish' : <><Plus size={20} /> {addText}</>}
      </button>
    )}
  </div>
);

const ProjectsManager = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '', desc: '', image: '', videoUrl: '', tag: '', link: '', githubUrl: '', downloadUrl: '', color: 'bg-[#f5f5f7]'
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projData);
      setLoading(false);
    }, (error) => {
      console.warn("Projects fetch error:", error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const uploadImageToImgBB = async (file: File) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error("ImgBB API kaliti topilmadi! .env faylni tekshiring.");
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error.message || "Rasm yuklashda xatolik yuz berdi");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const toastId = toast.loading("Rasm yuklanmoqda...");
      const imageUrl = await uploadImageToImgBB(file);
      setFormData({ ...formData, image: imageUrl });
      toast.success("Rasm muvaffaqiyatli yuklandi!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Iltimos, rasm yuklang!");
      return;
    }

    if (!isFirebaseConfigured || !db) {
      toast.error("Firebase ulanmagan!");
      return;
    }

    if (isSaving) return;

    try {
      setIsSaving(true);
      const toastId = toast.loading(editingId ? "Loyiha yangilanmoqda..." : "Loyiha saqlanmoqda...");
      
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), formData);
        toast.success("Loyiha muvaffaqiyatli yangilandi!", { id: toastId });
      } else {
        await addDoc(collection(db, 'projects'), formData);
        toast.success("Loyiha muvaffaqiyatli qo'shildi!", { id: toastId });
      }
      
      setIsAdding(false);
      setEditingId(null);
      setFormData({ title: '', desc: '', image: '', videoUrl: '', tag: '', link: '', githubUrl: '', downloadUrl: '', color: 'bg-[#f5f5f7]' });
    } catch (error) {
      console.error("Error saving document: ", error);
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (project: any) => {
    setFormData({
      title: project.title || '',
      desc: project.desc || '',
      image: project.image || '',
      videoUrl: project.videoUrl || '',
      tag: project.tag || '',
      link: project.link || '',
      githubUrl: project.githubUrl || '',
      downloadUrl: project.downloadUrl || '',
      color: project.color || 'bg-[#f5f5f7]'
    });
    setEditingId(project.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!isFirebaseConfigured || !db) return;
    
    try {
      await deleteDoc(doc(db, 'projects', id));
      toast.success("Loyiha o'chirildi");
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <AdminHeader 
        title="Loyihalar" 
        subtitle="Portfoliodagi loyihalarni boshqarish" 
        isAdding={isAdding} 
        onToggleAdd={() => setIsAdding(!isAdding)} 
      />

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mb-8">
              <h3 className="text-2xl font-bold mb-8 text-[#1d1d1f] dark:text-white">
                {editingId ? "Loyihani tahrirlash" : "Yangi loyiha qo'shish"}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Sarlavha</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Loyiha nomi" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Kategoriya (Tag)</label>
                  <input required type="text" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Masalan: Web Ilova" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Havola (Link)</label>
                  <input type="url" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="https://..." />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">GitHub Kodi (Link)</label>
                  <input type="url" value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="https://github.com/..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Fayl manzili (Ixtiyoriy link)</label>
                  <input 
                    type="url" 
                    value={formData.downloadUrl} 
                    onChange={e => setFormData({...formData, downloadUrl: e.target.value})} 
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" 
                    placeholder="https://... (Masalan, Google Drive, App Store...)" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Qisqacha ta'rif</label>
                  <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" rows={3} placeholder="Loyiha haqida qisqacha ma'lumot..."></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Loyiha rasmi</label>
                  <div 
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`w-full border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${formData.image ? 'border-blue-500 bg-blue-50/10' : 'border-gray-300 dark:border-white/10 hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-white/5'} ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    
                    {formData.image ? (
                      <div className="relative w-full max-w-md mx-auto h-64 rounded-xl overflow-hidden shadow-2xl">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setFormData({...formData, image: ''}); }}
                          className="absolute top-4 right-4 w-10 h-10 bg-black/50  text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/20 text-blue-500 rounded-3xl flex items-center justify-center mb-6">
                          {isUploading ? <UploadCloud className="animate-bounce" size={40} /> : <ImageIcon size={40} />}
                        </div>
                        <p className="text-[#1d1d1f] dark:text-white font-bold text-lg mb-2">
                          {isUploading ? 'Rasm yuklanmoqda...' : 'Rasmni yuklash uchun bosing'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG yoki WEBP (Max: 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <button 
                    type="submit" 
                    disabled={isUploading || !formData.image}
                    className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto shadow-lg shadow-blue-500/30"
                  >
                    {editingId ? "Yangilash va Saqlash" : "Saqlash va Nashr etish"}
                  </button>
                  {editingId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsAdding(false);
                        setEditingId(null);
                        setFormData({ title: '', desc: '', image: '', videoUrl: '', tag: '', link: '', githubUrl: '', downloadUrl: '', color: 'bg-[#f5f5f7]' });
                      }}
                      className="bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white px-10 py-4 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-white/20 transition-colors w-full md:w-auto"
                    >
                      Bekor qilish
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          <>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : projects.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-white/10">
            <FolderKanban className="mx-auto text-gray-300 dark:text-gray-600 mb-6" size={64} />
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Hali loyihalar qo'shilmagan.</p>
          </div>
        ) : projects.map((project, index) => (
          <motion.div 
            key={project.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white dark:bg-[#0a0a0a] rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-lg shadow-black/5 group transition-transform duration-300"
          >
            <div className="h-64 overflow-hidden relative">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                <button 
                  onClick={() => handleEdit(project)}
                  className="w-12 h-12 bg-white/90  rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-colors shadow-lg"
                  title="Tahrirlash"
                >
                  <PenTool size={20} />
                </button>
                <DeleteButton 
                  onConfirm={() => handleDelete(project.id)} 
                  title="Loyihani o'chirish" 
                  message="Haqiqatan ham bu loyihani o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."
                  className="w-12 h-12 bg-white/90  rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                >
                  <Trash2 size={20} />
                </DeleteButton>
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 block bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">{project.tag}</span>
                {project.githubUrl && <Github size={20} className="text-gray-400 hover:text-[#1d1d1f] dark:hover:text-white transition-colors" />}
              </div>
              <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-3">{project.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">{project.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [formData, setFormData] = useState({ role: '', company: '', year: '', desc: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const unsubscribe = onSnapshot(collection(db, 'experiences'), (snapshot) => {
      setExperiences(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => b.year - a.year));
    }, (error) => console.warn("Experiences fetch error:", error.message));
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'experiences', editingId), formData);
        toast.success("Tajriba yangilandi");
      } else {
        await addDoc(collection(db, 'experiences'), formData);
        toast.success("Tajriba qo'shildi");
      }
      setFormData({ role: '', company: '', year: '', desc: '' });
      setIsAdding(false);
      setEditingId(null);
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  const handleEdit = (exp: any) => {
    setFormData({ role: exp.role, company: exp.company, year: exp.year, desc: exp.desc });
    setEditingId(exp.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'experiences', id));
      toast.success("O'chirildi");
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <AdminHeader 
        title="Tajriba" 
        subtitle="Ish tajribasi va faoliyat" 
        isAdding={isAdding} 
        onToggleAdd={() => {
          setIsAdding(!isAdding);
          if (isAdding) {
            setEditingId(null);
            setFormData({ role: '', company: '', year: '', desc: '' });
          }
        }} 
      />

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mb-8">
              <h3 className="text-2xl font-bold mb-8 text-[#1d1d1f] dark:text-white">
                {editingId ? "Tajribani tahrirlash" : "Yangi tajriba qo'shish"}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Lavozim</label>
                  <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Frontend Developer" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Kompaniya</label>
                  <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Google Inc." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Yil</label>
                  <input required type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="2022 - 2024" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Ta'rif</label>
                  <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" rows={3} placeholder="Nimalar qildingiz..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors w-full md:w-auto shadow-lg shadow-blue-500/30">
                    {editingId ? "Yangilash va Saqlash" : "Tajriba qo'shish"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex justify-between items-start bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 group hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <div>
                <p className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-1">{exp.role} <span className="text-blue-600 dark:text-blue-400 ml-2 text-base font-medium bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">{exp.year}</span></p>
                <p className="text-base text-gray-600 dark:text-gray-300 font-medium mb-2">{exp.company}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">{exp.desc}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(exp)}
                  className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 p-3 rounded-xl transition-all"
                  title="Tahrirlash"
                >
                  <PenTool size={18} />
                </button>
                <DeleteButton 
                  onConfirm={() => handleDelete(exp.id)} 
                  title="Tajribani o'chirish" 
                  message="Haqiqatan ham bu tajribani o'chirmoqchimisiz?"
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-3 rounded-xl transition-all"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const EducationManager = () => {
  const [education, setEducation] = useState<any[]>([]);
  const [formData, setFormData] = useState({ degree: '', institution: '', year: '', desc: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const unsubscribe = onSnapshot(collection(db, 'education'), (snapshot) => {
      setEducation(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => b.year - a.year));
    }, (error) => console.warn("Education fetch error:", error.message));
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'education', editingId), formData);
        toast.success("Ta'lim yangilandi");
      } else {
        await addDoc(collection(db, 'education'), formData);
        toast.success("Ta'lim qo'shildi");
      }
      setFormData({ degree: '', institution: '', year: '', desc: '' });
      setIsAdding(false);
      setEditingId(null);
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  const handleEdit = (edu: any) => {
    setFormData({ degree: edu.degree, institution: edu.institution, year: edu.year, desc: edu.desc });
    setEditingId(edu.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'education', id));
      toast.success("O'chirildi");
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <AdminHeader 
        title="Ta'lim" 
        subtitle="O'qish joylari va darajalar" 
        isAdding={isAdding} 
        onToggleAdd={() => {
          setIsAdding(!isAdding);
          if (isAdding) {
            setEditingId(null);
            setFormData({ degree: '', institution: '', year: '', desc: '' });
          }
        }} 
      />

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mb-8">
              <h3 className="text-2xl font-bold mb-8 text-[#1d1d1f] dark:text-white">
                {editingId ? "Ta'limni tahrirlash" : "Yangi ta'lim qo'shish"}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Daraja / Yo'nalish</label>
                  <input required type="text" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Bakalavr..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Muassasa</label>
                  <input required type="text" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Universitet nomi..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Yil</label>
                  <input required type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="2018 - 2022" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Ta'rif</label>
                  <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" rows={3} placeholder="Nimalar o'rgandingiz..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors w-full md:w-auto shadow-lg shadow-blue-500/30">
                    {editingId ? "Yangilash va Saqlash" : "Ta'lim qo'shish"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
        <div className="space-y-4">
          {education.map((edu, index) => (
            <motion.div 
              key={edu.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex justify-between items-start bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 group hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <div>
                <p className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-1">{edu.degree} <span className="text-blue-600 dark:text-blue-400 ml-2 text-base font-medium bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">{edu.year}</span></p>
                <p className="text-base text-gray-600 dark:text-gray-300 font-medium mb-2">{edu.institution}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">{edu.desc}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(edu)}
                  className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 p-3 rounded-xl transition-all"
                  title="Tahrirlash"
                >
                  <PenTool size={18} />
                </button>
                <DeleteButton 
                  onConfirm={() => handleDelete(edu.id)} 
                  title="Ta'limni o'chirish" 
                  message="Haqiqatan ham bu ta'limni o'chirmoqchimisiz?"
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-3 rounded-xl transition-all"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const PRESET_SKILLS = [
  // Frontend
  { name: 'React', slug: 'react', category: 'Frontend' },
  { name: 'Next.js', slug: 'nextdotjs', category: 'Frontend' },
  { name: 'Vue.js', slug: 'vuedotjs', category: 'Frontend' },
  { name: 'Nuxt.js', slug: 'nuxtdotjs', category: 'Frontend' },
  { name: 'Angular', slug: 'angular', category: 'Frontend' },
  { name: 'Svelte', slug: 'svelte', category: 'Frontend' },
  { name: 'Redux', slug: 'redux', category: 'Frontend' },
  { name: 'JavaScript', slug: 'javascript', category: 'Frontend' },
  { name: 'TypeScript', slug: 'typescript', category: 'Frontend' },
  { name: 'HTML5', slug: 'html5', category: 'Frontend' },
  { name: 'CSS3', slug: 'css3', category: 'Frontend' },
  { name: 'Tailwind CSS', slug: 'tailwindcss', category: 'Frontend' },
  { name: 'Sass', slug: 'sass', category: 'Frontend' },
  { name: 'Bootstrap', slug: 'bootstrap', category: 'Frontend' },
  { name: 'Material UI', slug: 'mui', category: 'Frontend' },
  { name: 'Framer Motion', slug: 'framer', category: 'Frontend' },

  // Backend
  { name: 'Node.js', slug: 'nodedotjs', category: 'Backend' },
  { name: 'Express', slug: 'express', category: 'Backend' },
  { name: 'NestJS', slug: 'nestjs', category: 'Backend' },
  { name: 'Python', slug: 'python', category: 'Backend' },
  { name: 'Django', slug: 'django', category: 'Backend' },
  { name: 'FastAPI', slug: 'fastapi', category: 'Backend' },
  { name: 'Java', slug: 'java', category: 'Backend' },
  { name: 'Spring', slug: 'spring', category: 'Backend' },
  { name: 'C#', slug: 'csharp', category: 'Backend' },
  { name: 'Dotnet', slug: 'dotnet', category: 'Backend' },
  { name: 'PHP', slug: 'php', category: 'Backend' },
  { name: 'Laravel', slug: 'laravel', category: 'Backend' },
  { name: 'Ruby', slug: 'ruby', category: 'Backend' },
  { name: 'Ruby on Rails', slug: 'rubyonrails', category: 'Backend' },
  { name: 'Go', slug: 'go', category: 'Backend' },
  { name: 'Rust', slug: 'rust', category: 'Backend' },
  { name: 'C++', slug: 'cplusplus', category: 'Backend' },

  // Database
  { name: 'MongoDB', slug: 'mongodb', category: 'Database' },
  { name: 'PostgreSQL', slug: 'postgresql', category: 'Database' },
  { name: 'MySQL', slug: 'mysql', category: 'Database' },
  { name: 'SQLite', slug: 'sqlite', category: 'Database' },
  { name: 'Redis', slug: 'redis', category: 'Database' },
  { name: 'Firebase', slug: 'firebase', category: 'Database' },
  { name: 'Supabase', slug: 'supabase', category: 'Database' },
  { name: 'Prisma', slug: 'prisma', category: 'Database' },
  { name: 'GraphQL', slug: 'graphql', category: 'Database' },

  // DevOps & Tools
  { name: 'Docker', slug: 'docker', category: 'DevOps' },
  { name: 'Kubernetes', slug: 'kubernetes', category: 'DevOps' },
  { name: 'AWS', slug: 'amazonaws', category: 'DevOps' },
  { name: 'Google Cloud', slug: 'googlecloud', category: 'DevOps' },
  { name: 'Vercel', slug: 'vercel', category: 'DevOps' },
  { name: 'Netlify', slug: 'netlify', category: 'DevOps' },
  { name: 'GitHub Actions', slug: 'githubactions', category: 'DevOps' },
  { name: 'Git', slug: 'git', category: 'DevOps' },
  { name: 'Linux', slug: 'linux', category: 'DevOps' },
  { name: 'Nginx', slug: 'nginx', category: 'DevOps' },

  // Design & Others
  { name: 'Figma', slug: 'figma', category: 'Design' },
  { name: 'Adobe XD', slug: 'adobexd', category: 'Design' },
  { name: 'Photoshop', slug: 'adobephotoshop', category: 'Design' },
  { name: 'Illustrator', slug: 'adobeillustrator', category: 'Design' },
  { name: 'Jest', slug: 'jest', category: 'Tools' },
  { name: 'Webpack', slug: 'webpack', category: 'Tools' },
  { name: 'Vite', slug: 'vite', category: 'Tools' },
  { name: 'Postman', slug: 'postman', category: 'Tools' },
];

const SkillsManager = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', level: '50', iconUrl: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const unsubscribe = onSnapshot(collection(db, 'skills'), (snapshot) => {
      setSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.warn("Skills fetch error:", error.message));
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.level) return;
    try {
      const data = { name: formData.name, level: parseInt(formData.level), iconUrl: formData.iconUrl || `https://cdn.simpleicons.org/${formData.name.toLowerCase().replace(/\s+/g, '')}` };
      if (editingId) {
        await updateDoc(doc(db, 'skills', editingId), data);
        toast.success("Ko'nikma yangilandi");
      } else {
        await addDoc(collection(db, 'skills'), data);
        toast.success("Ko'nikma qo'shildi");
      }
      setFormData({ name: '', level: '50', iconUrl: '' });
      setIsAdding(false);
      setEditingId(null);
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  const handleEdit = (skill: any) => {
    setFormData({ name: skill.name, level: String(skill.level), iconUrl: skill.iconUrl || '' });
    setEditingId(skill.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'skills', id));
      toast.success("O'chirildi");
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <AdminHeader 
        title="Ko'nikmalar" 
        subtitle="Dasturlash tillari va texnologiyalar" 
        isAdding={isAdding} 
        onToggleAdd={() => {
          setIsAdding(!isAdding);
          if (isAdding) {
            setEditingId(null);
            setFormData({ name: '', level: '50', iconUrl: '' });
          }
        }} 
      />

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mb-8">
              <h3 className="text-2xl font-bold mb-8 text-[#1d1d1f] dark:text-white">
                {editingId ? "Ko'nikmani tahrirlash" : "Yangi ko'nikma qo'shish"}
              </h3>
              
              {!editingId && (
                <div className="mb-8">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-3 uppercase tracking-wider">Tezkor tanlash (Tayyor iconlar)</label>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-[#0a0a0a]/50 rounded-xl border border-gray-100 dark:border-white/5 scrollbar-thin">
                    {PRESET_SKILLS.map(preset => (
                      <button
                        key={preset.slug}
                        type="button"
                        onClick={() => setFormData({ ...formData, name: preset.name, iconUrl: `https://cdn.simpleicons.org/${preset.slug}/000000` })}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium transition-colors text-[#1d1d1f] dark:text-white shadow-sm"
                      >
                        <div className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-white/90 rounded-md p-0.5">
                          <img src={`https://cdn.simpleicons.org/${preset.slug}`} alt={preset.name} className="w-full h-full object-contain" />
                        </div>
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Nomi</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="React, Node.js..." />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Icon URL (ixtiyoriy)</label>
                    <input type="url" value={formData.iconUrl} onChange={e => setFormData({...formData, iconUrl: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="https://... (SVG yoki Png)" />
                  </div>
                  <div className="w-full md:w-32">
                    <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Daraja (%)</label>
                    <input required type="number" min="0" max="100" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors w-full md:w-auto min-w-[200px] shadow-lg shadow-blue-500/30">
                    {editingId ? "Yangilash" : "Qo'shish"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((s, index) => (
            <motion.div 
              key={s.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 group hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-[#1d1d1f] dark:text-white text-lg">{s.name}</p>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-lg">{s.level}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${s.level}%` }}></div>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                <button 
                  onClick={() => handleEdit(s)}
                  className="text-gray-400 hover:text-blue-500 p-2 rounded-lg transition-colors"
                >
                  <PenTool size={16} />
                </button>
                <DeleteButton 
                  onConfirm={() => handleDelete(s.id)} 
                  title="Ko'nikmani o'chirish" 
                  message="Haqiqatan ham bu ko'nikmani o'chirmoqchimisiz?"
                  className="text-gray-400 hover:text-red-500 p-2 rounded-lg transition-colors"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const CertificatesManager = () => {
  const [certs, setCerts] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', issuer: '', year: '', link: '', image: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const unsubscribe = onSnapshot(collection(db, 'certificates'), (snapshot) => {
      setCerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.warn("Certs fetch error:", error.message));
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'certificates', editingId), formData);
        toast.success("Sertifikat yangilandi");
      } else {
        await addDoc(collection(db, 'certificates'), formData);
        toast.success("Sertifikat qo'shildi");
      }
      setFormData({ title: '', issuer: '', year: '', link: '', image: '' });
      setIsAdding(false);
      setEditingId(null);
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  const handleEdit = (cert: any) => {
    setFormData({ title: cert.title, issuer: cert.issuer, year: cert.year, link: cert.link || '', image: cert.image || '' });
    setEditingId(cert.id);
    setIsAdding(true);
  };

  const uploadImageToImgBB = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY || '6d2abda26cb682c3f851da8181ad3ea2'}`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      return data.data.url;
    }
    throw new Error('Rasm yuklashda xatolik');
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const toastId = toast.loading("Rasm yuklanmoqda...");
      const imageUrl = await uploadImageToImgBB(file);
      setFormData({ ...formData, image: imageUrl });
      toast.success("Rasm muvaffaqiyatli yuklandi!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'certificates', id));
      toast.success("O'chirildi");
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <AdminHeader 
        title="Sertifikatlar" 
        subtitle="Yutuqlar va sertifikatlar" 
        isAdding={isAdding} 
        onToggleAdd={() => {
          setIsAdding(!isAdding);
          if (isAdding) {
            setEditingId(null);
            setFormData({ title: '', issuer: '', year: '', link: '', image: '' });
          }
        }} 
      />

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mb-8">
              <h3 className="text-2xl font-bold mb-8 text-[#1d1d1f] dark:text-white">
                {editingId ? "Sertifikatni tahrirlash" : "Yangi sertifikat qo'shish"}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Nomi</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="AWS Certified..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Tashkilot</label>
                  <input required type="text" value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Amazon..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Yil</label>
                  <input required type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="2024" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Havola (ixtiyoriy)</label>
                  <input type="url" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Preview Rasm (ixtiyoriy)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="text" 
                      value={formData.image} 
                      onChange={e => setFormData({...formData, image: e.target.value})} 
                      className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" 
                      placeholder="Rasm URL manzili" 
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="bg-blue-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Upload size={20} />
                      {isUploading ? 'Yuklanmoqda...' : 'Yuklash'}
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                  {formData.image && (
                    <div className="mt-4 relative w-32 h-24 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors w-full md:w-auto shadow-lg shadow-blue-500/30">
                    {editingId ? "Yangilash va Saqlash" : "Sertifikat qo'shish"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((c, index) => (
            <motion.div 
              key={c.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 group hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-6">
                {c.image ? (
                  <div className="w-20 h-14 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 flex-shrink-0">
                    <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-14 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <ImageIcon size={20} />
                  </div>
                )}
                <div>
                  <p className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-1">{c.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{c.issuer} • {c.year}</p>
                  {c.link && <a href={c.link} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mt-2 inline-block hover:underline">Sertifikatni ko'rish</a>}
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(c)}
                  className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 p-3 rounded-xl transition-all"
                  title="Tahrirlash"
                >
                  <PenTool size={18} />
                </button>
                <DeleteButton 
                  onConfirm={() => handleDelete(c.id)} 
                  title="Sertifikatni o'chirish" 
                  message="Haqiqatan ham bu sertifikatni o'chirmoqchimisiz?"
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-3 rounded-xl transition-all"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ServicesManager = () => {
  const [services, setServices] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', desc: '', icon: 'Code' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const unsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.warn("Services fetch error:", error.message));
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), formData);
        toast.success("Xizmat yangilandi");
      } else {
        await addDoc(collection(db, 'services'), formData);
        toast.success("Xizmat qo'shildi");
      }
      setFormData({ title: '', desc: '', icon: 'Code' });
      setIsAdding(false);
      setEditingId(null);
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  const handleEdit = (service: any) => {
    setFormData({ title: service.title, desc: service.desc, icon: service.icon });
    setEditingId(service.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      toast.success("O'chirildi");
    } catch (e) {
      toast.error("Xatolik");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <AdminHeader 
        title="Xizmatlar" 
        subtitle="Taklif etiladigan xizmatlar" 
        isAdding={isAdding} 
        onToggleAdd={() => {
          setIsAdding(!isAdding);
          if (isAdding) {
            setEditingId(null);
            setFormData({ title: '', desc: '', icon: 'Code' });
          }
        }} 
      />

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mb-8">
              <h3 className="text-2xl font-bold mb-8 text-[#1d1d1f] dark:text-white">
                {editingId ? "Xizmatni tahrirlash" : "Yangi xizmat qo'shish"}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Nomi</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Web Dasturlash" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Ikonka</label>
                  <select value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium">
                    <option value="Code">Code</option>
                    <option value="MonitorSmartphone">Monitor & Smartphone</option>
                    <option value="Server">Server</option>
                    <option value="PenTool">Pen Tool (Design)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Ta'rif</label>
                  <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" rows={3} placeholder="Xizmat haqida ma'lumot..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors w-full md:w-auto shadow-lg shadow-blue-500/30">
                    {editingId ? "Yangilash va Saqlash" : "Xizmat qo'shish"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s, index) => (
            <motion.div 
              key={s.id} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 group hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <div>
                <p className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-1">{s.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.desc}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(s)}
                  className="text-gray-400 hover:text-blue-500 p-2 rounded-lg transition-colors"
                >
                  <PenTool size={18} />
                </button>
                <DeleteButton 
                  onConfirm={() => handleDelete(s.id)} 
                  title="Xizmatni o'chirish" 
                  message="Haqiqatan ham bu xizmatni o'chirmoqchimisiz?"
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-3 rounded-xl transition-all"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SettingsManager = () => {
  const [heroImage, setHeroImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [socials, setSocials] = useState({ 
    github: '', linkedin: '', telegram: '', instagram: '', resume: '', email: '',
    aboutTitle: 'Sodda. Kreativ. Samarali.', 
    aboutShort: 'Dasturlash men uchun shunchaki kod yozish emas, balki insonlar hayotini yengillashtiruvchi vositalar yaratishdir.', 
    aboutFull: 'Dasturlash men uchun shunchaki kod yozish emas, balki insonlar hayotini yengillashtiruvchi vositalar yaratishdir. Har bir loyihada minimalizm va yuqori unumdorlikni birinchi o\'ringa qo\'yaman.\n\nMening maqsadim - foydalanuvchi interfeyslarini shunchalik sodda qilishki, hatto birinchi marta kirgan odam ham o\'zini uydagidek his qilsin. Murakkab muammolarga kreativ yechimlar topish mening asosiy kuchimdir.', 
    expYears: '1+', 
    githubCommits: '1.2k', 
    githubYearText: 'Bu yilgi faollik',
    spotifySong: 'Lofi Hip Hop Radio', 
    spotifyArtist: 'ChilledCow'
  });
  const [isSavingSocials, setIsSavingSocials] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'hero'));
        if (docSnap.exists() && docSnap.data().image) {
          setHeroImage(docSnap.data().image);
        }
        
        const generalSnap = await getDoc(doc(db, 'settings', 'general'));
        if (generalSnap.exists()) {
          setSocials({ ...socials, ...generalSnap.data() });
        }
      } catch (error: any) {
        console.warn("Settings fetch error:", error.message);
      }
    };
    fetchSettings();
  }, []);

  const uploadImageToImgBB = async (file: File) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error("ImgBB API kaliti topilmadi! .env faylni tekshiring.");
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error.message || "Rasm yuklashda xatolik yuz berdi");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const toastId = toast.loading("Rasm yuklanmoqda...");
      const imageUrl = await uploadImageToImgBB(file);
      
      if (isFirebaseConfigured && db) {
        await setDoc(doc(db, 'settings', 'hero'), { image: imageUrl }, { merge: true });
      }
      
      setHeroImage(imageUrl);
      toast.success("Hero rasmi muvaffaqiyatli saqlandi!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Xatolik yuz berdi");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async () => {
    if (!isFirebaseConfigured || !db) return;
    try {
      await setDoc(doc(db, 'settings', 'hero'), { image: '' }, { merge: true });
      setHeroImage('');
      toast.success("Rasm o'chirildi");
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Removed R2 upload logic
    toast.error("Fayl yuklash hozircha o'chirilgan. Iltimos, link kiriting.");
  };

  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured || !db) return;
    setIsSavingSocials(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), socials, { merge: true });
      toast.success("Ma'lumotlar saqlandi");
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsSavingSocials(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <AdminHeader 
        title="Sozlamalar" 
        subtitle="Sayt sozlamalari va ko'rinishi" 
      />

      <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <ImageIcon size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Hero Rasmi</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Bosh sahifadagi asosiy rasm (ixtiyoriy)</p>
          </div>
        </div>

        <div className="mb-8 max-w-2xl">
          <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Rasm URL manzili (Link yoki /public papkadan)</label>
          <input 
            type="text" 
            value={heroImage} 
            onChange={async (e) => {
              const val = e.target.value;
              setHeroImage(val);
              if (isFirebaseConfigured && db) {
                await setDoc(doc(db, 'settings', 'hero'), { image: val }, { merge: true });
              }
            }} 
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" 
            placeholder="https://... yoki /me.jpg" 
          />
          <p className="text-sm text-gray-500 mt-2">Siz to'g'ridan-to'g'ri rasm linkini kiritishingiz yoki public papkadagi rasm nomini (masalan: /me.jpg) yozishingiz mumkin.</p>
        </div>

        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-12 ${heroImage ? 'border-blue-500 bg-blue-50/10' : 'border-gray-300 dark:border-white/10 hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-white/5'} ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          {heroImage ? (
            <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-2xl">
              <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50  text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/20 text-blue-500 rounded-3xl flex items-center justify-center mb-6">
                {isUploading ? <UploadCloud className="animate-bounce" size={40} /> : <ImageIcon size={40} />}
              </div>
              <p className="text-[#1d1d1f] dark:text-white font-bold text-lg mb-2">
                {isUploading ? 'Rasm yuklanmoqda...' : 'Rasmni yuklash uchun bosing'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG yoki WEBP (Max: 5MB)</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-white/10 pt-12">
          <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-8">Men haqimda (BentoGrid)</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mb-12">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Sarlavha</label>
              <input type="text" value={socials.aboutTitle} onChange={e => setSocials({...socials, aboutTitle: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Sodda. Kreativ. Samarali." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Qisqacha ma'lumot</label>
              <textarea value={socials.aboutShort} onChange={e => setSocials({...socials, aboutShort: e.target.value})} rows={2} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Qisqacha ma'lumot..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">To'liq ma'lumot</label>
              <textarea value={socials.aboutFull} onChange={e => setSocials({...socials, aboutFull: e.target.value})} rows={5} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="To'liq ma'lumot..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Tajriba yillari</label>
              <input type="text" value={socials.expYears} onChange={e => setSocials({...socials, expYears: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="3+" />
            </div>
          </form>

          <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-8">GitHub & Spotify (BentoGrid)</h3>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mb-12">
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">GitHub Commits</label>
              <input type="text" value={socials.githubCommits} onChange={e => setSocials({...socials, githubCommits: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="1.2k" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">GitHub Matn</label>
              <input type="text" value={socials.githubYearText} onChange={e => setSocials({...socials, githubYearText: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Bu yilgi faollik" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Spotify Qo'shiq</label>
              <input type="text" value={socials.spotifySong} onChange={e => setSocials({...socials, spotifySong: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="Lofi Hip Hop Radio" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Spotify Ijrochi</label>
              <input type="text" value={socials.spotifyArtist} onChange={e => setSocials({...socials, spotifyArtist: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="ChilledCow" />
            </div>
          </form>

          <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-8">Ijtimoiy tarmoqlar va Havolalar</h3>
          <form onSubmit={handleSaveSocials} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Email</label>
              <input type="email" value={socials.email} onChange={e => setSocials({...socials, email: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="hello@misol.uz" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Rezyume Linki (URL yoki Fayl)</label>
              <p className="text-xs text-gray-500 mb-3">
                Rezyumeni ikki xil usulda qo'shishingiz mumkin:<br/>
                1. <b>Link orqali:</b> Google Drive yoki boshqa joydagi to'liq linkni kiriting (masalan, <code>https://...</code>)<br/>
                2. <b>Fayl orqali:</b> Rezyume faylini (masalan, <code>resume.pdf</code>) loyihaning <code>public</code> papkasiga yuklang va bu yerga <code>/resume.pdf</code> deb yozing.
              </p>
              <div className="flex items-center gap-4">
                <input 
                  type="text" 
                  value={socials.resume} 
                  onChange={e => setSocials({...socials, resume: e.target.value})} 
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" 
                  placeholder="https://... yoki /resume.pdf" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">GitHub</label>
              <input type="url" value={socials.github} onChange={e => setSocials({...socials, github: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">LinkedIn</label>
              <input type="url" value={socials.linkedin} onChange={e => setSocials({...socials, linkedin: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Telegram</label>
              <input type="url" value={socials.telegram} onChange={e => setSocials({...socials, telegram: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="https://t.me/..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1d1d1f] dark:text-gray-300 mb-2 uppercase tracking-wider">Instagram</label>
              <input type="url" value={socials.instagram} onChange={e => setSocials({...socials, instagram: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium" placeholder="https://instagram.com/..." />
            </div>
            <div className="md:col-span-2 mt-4">
              <button type="submit" disabled={isSavingSocials} className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/30 w-full md:w-auto">
                {isSavingSocials ? 'Saqlanmoqda...' : 'O\'zgarishlarni saqlash'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

const MessagesManager = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'messages'), (snapshot) => {
      const msgData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMessages(msgData);
      setLoading(false);
    }, (error) => {
      console.warn("Messages fetch error:", error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!isFirebaseConfigured || !db) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
      toast.success("Xabar o'chirildi");
    } catch (error) {
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <AdminHeader 
        title="Xabarlar" 
        subtitle="Portfoliodan kelgan xabarlar" 
      />

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Yuklanmoqda...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-white/10">
            <MessageSquare className="mx-auto text-gray-300 dark:text-gray-600 mb-6" size={64} />
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Hali xabarlar yo'q.</p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-lg shadow-black/5 flex flex-col md:flex-row gap-8 justify-between items-start group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white">{msg.name}</h3>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider">{new Date(msg.createdAt).toLocaleString('uz-UZ')}</span>
                  </div>
                  <a href={`mailto:${msg.email}`} className="text-blue-600 dark:text-blue-400 text-sm font-bold mb-6 inline-block hover:underline">{msg.email}</a>
                  <p className="text-[#1d1d1f] dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl leading-relaxed">{msg.message}</p>
                </div>
                <DeleteButton 
                  onConfirm={() => handleDelete(msg.id)} 
                  title="Xabarni o'chirish" 
                  message="Haqiqatan ham bu xabarni o'chirmoqchimisiz?"
                  className="w-12 h-12 shrink-0 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 size={20} />
                </DeleteButton>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

const GuestbookManager = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      setMessages(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error: any) => {
      console.warn("Guestbook fetch error:", error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!isFirebaseConfigured || !db) return;
    try {
      await deleteDoc(doc(db, 'guestbook', id));
      toast.success("Izoh o'chirildi");
    } catch (error) {
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <AdminHeader 
        title="Mehmonlar Kitobi" 
        subtitle="Sayt mehmonlarining izohlari" 
      />

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Yuklanmoqda...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-white/10">
            <MessageSquare className="mx-auto text-gray-300 dark:text-gray-600 mb-6" size={64} />
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Hali izohlar yo'q.</p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-[#0a0a0a] p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-lg shadow-black/5 flex flex-col md:flex-row gap-8 justify-between items-start group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={msg.userPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.userName}`} alt="Avatar" className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                         <h3 className="text-lg font-bold text-[#1d1d1f] dark:text-white">{msg.userName}</h3>
                         {msg.githubParams && <span className="text-[10px] text-gray-500 bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-full">@{msg.githubParams}</span>}
                      </div>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString('uz-UZ') : ''}</span>
                    </div>
                  </div>
                  <p className="text-[#1d1d1f] dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl leading-relaxed">{msg.text}</p>
                </div>
                <DeleteButton 
                  onConfirm={() => handleDelete(msg.id)} 
                  title="Izohni o'chirish" 
                  message="Haqiqatan ham bu izohni o'chirmoqchimisiz?"
                  className="w-12 h-12 shrink-0 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 size={20} />
                </DeleteButton>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

const TranslationsManager = () => {
  const [data, setData] = useState<string>('{}');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const fetchTranslations = async () => {
      try {
        const docRef = doc(db, 'settings', 'translations');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().data) {
          setData(typeof docSnap.data().data === 'string' ? docSnap.data().data : JSON.stringify(docSnap.data().data, null, 2));
        } else {
          // Provide a helpful template if it's empty
          setData('{\n  "UZ": {\n    "statsCards": [\n      { "text": "Tugallangan Loyihalar", "value": "50+" },\n      { "text": "Xursand Mijozlar", "value": "30+" },\n      { "text": "Qator Kod", "value": "100k+" },\n      { "text": "Chashka Qahva", "value": "500+" }\n    ]\n  }\n}');
        }
      } catch (error) {}
    };
    fetchTranslations();
  }, []);

  const handleSave = async () => {
    if (!isFirebaseConfigured || !db) return;
    setSaving(true);
    try {
      // Validate JSON
      JSON.parse(data);
      await setDoc(doc(db, 'settings', 'translations'), { data, updatedAt: new Date().toISOString() });
      toast.success("Matnlar saqlandi");
    } catch (error: any) {
      toast.error("JSON noto'g'ri formatda: " + error.message);
    }
    setSaving(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#1d1d1f] dark:text-white">Sayt Matnlari (JSON)</h2>
          <p className="text-gray-500 mt-1.5 font-medium">Barcha tillardagi sayt matnlarini (jumladan Statistikalar) JSON shaklida tahrirlang.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center">
          {saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
      </div>

      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-100 dark:border-white/10 p-6">
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
          Eslatma: Mavjud JSON kalitlarini o'zgartirmang, faqat qiymatlarini (matnlarni) tahrirlang. Masalan, UZ.nav.about o'rniga boshqa so'z yozishingiz mumkin.
        </p>
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          rows={25}
          className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 font-mono text-sm text-[#1d1d1f] dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          placeholder='Masalan:&#10;{&#10;  "UZ": { "sayt_sarlavha": "Mening saytim" }&#10;}'
        />
      </div>
    </motion.div>
  );
};


const SessionsManager = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    const q = query(collection(db, 'sessions'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Sort in memory to avoid missing index error
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a: any, b: any) => {
        const timeA = a.lastActive?.seconds || 0;
        const timeB = b.lastActive?.seconds || 0;
        return timeB - timeA;
      });
      setSessions(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching sessions: ", error);
      toast.error("Seanslarni yuklashda xatolik yuz berdi");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogoutDevice = async (id: string) => {
    if (!isFirebaseConfigured || !db) return;
    try {
      await deleteDoc(doc(db, 'sessions', id));
      toast.success("Qurilma tizimdan chiqarildi");
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    }
  };

  const currentSessionId = localStorage.getItem('adminSessionId');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-7xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-[#1d1d1f] dark:text-white mb-2">Faol Seanslar</h2>
          <p className="text-gray-500">Tizimga ulangan barcha qurilmalar reyestri</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a0a0a] rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                <th className="p-4 pl-6 text-sm font-semibold text-gray-500 uppercase tracking-wider w-1/3">Qurilma / OS</th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Brauzer</th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Holat</th>
                <th className="p-4 pr-6 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    <div className="flex justify-center mb-4">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Faol seanslar yo'q</td></tr>
              ) : sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        {session.os === 'Windows' || session.os === 'macOS' || session.os === 'Linux' ? <Laptop size={20} /> : <MonitorSmartphone size={20} />}
                      </div>
                      <div>
                        <div className="font-bold text-[#1d1d1f] dark:text-white flex items-center gap-2">
                          {session.os}
                          {session.id === currentSessionId && (
                            <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Joriy</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-1 max-w-[200px] truncate" title={session.userAgent}>{session.userAgent}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-[#1d1d1f] dark:text-white font-medium">{session.browser}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm font-medium text-green-500">Faol</span>
                    </div>
                    {session.loginTime && (
                       <div className="text-xs text-gray-500 mt-1">Kirgan: {new Date(session.loginTime.seconds * 1000).toLocaleString('uz-UZ')}</div>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    {session.id !== currentSessionId && (
                      <button 
                        onClick={() => handleLogoutDevice(session.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                        title="Tizimdan chiqarish"
                      >
                        <LogOut size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const currentSessionId = localStorage.getItem('adminSessionId');
    if (currentSessionId) {
      const unsubscribe = onSnapshot(doc(db, 'sessions', currentSessionId), (docSnap) => {
        if (!docSnap.exists()) {
          // Session was deleted remotely
          localStorage.removeItem('adminSessionId');
          signOut(auth);
          toast.error("Seansingiz tugatildi");
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      navigate('/login');
      return;
    }
    
    const unsubscribe = auth?.onAuthStateChanged((user: any) => {
      if (!user) {
        navigate('/login');
      }
    });
    return () => unsubscribe && unsubscribe();
  }, [navigate]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    if (isFirebaseConfigured && auth && db) {
      const currentSessionId = localStorage.getItem('adminSessionId');
      if (currentSessionId) {
        try {
          await deleteDoc(doc(db, 'sessions', currentSessionId));
        } catch (e) {
          console.error("Session delete error", e);
        }
        localStorage.removeItem('adminSessionId');
      }
      await signOut(auth);
    }
    toast.success("Tizimdan chiqdingiz");
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/projects', icon: <FolderKanban size={20} />, label: 'Loyihalar' },
    { path: '/admin/services', icon: <MonitorSmartphone size={20} />, label: 'Xizmatlar' },
    { path: '/admin/experience', icon: <Briefcase size={20} />, label: 'Tajriba' },
    { path: '/admin/education', icon: <GraduationCap size={20} />, label: "Ta'lim" },
    { path: '/admin/skills', icon: <Code size={20} />, label: "Ko'nikmalar" },
    { path: '/admin/certs', icon: <Award size={20} />, label: 'Sertifikatlar' },
    { path: '/admin/messages', icon: <MessageSquare size={20} />, label: 'Xabarlar' },
    { path: '/admin/guestbook', icon: <Users size={20} />, label: 'Mehmonlar' },
    { path: '/admin/translations', icon: <PenTool size={20} />, label: 'Matnlar' },
    { path: '/admin/sessions', icon: <Activity className="w-5 h-5" />, label: 'Seanslar' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Sozlamalar' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fe] dark:bg-[#050505] font-sans selection:bg-blue-500/30">
      
      {/* Mobile Topbar */}
      <div className="md:hidden sticky top-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg font-black text-lg">S</div>
          <span className="font-bold text-[#1d1d1f] dark:text-white">Admin Panel</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 rounded-xl">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar overlay for mobile */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60  z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed md:sticky top-0 left-0 h-screen w-[280px] bg-white dark:bg-[#0a0a0a] border-r border-gray-200 text-gray-800 dark:text-white dark:border-white/5 flex flex-col z-50 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-8 hidden md:block">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">S</div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">Sanjarbek.</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mt-0.5">Admin Panel</p>
              </div>
            </Link>
          </div>
          
          <nav className="flex-1 px-4 space-y-1.5 mt-8 md:mt-2 overflow-y-auto scrollbar-hide">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-4 mb-4">Menyu</div>
            {navItems.map((item, index) => {
              const isActive = item.path === '/admin' ? location.pathname === '/admin' : (location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
              return (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[1rem] font-medium transition-all group relative overflow-hidden ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#1d1d1f] dark:hover:text-white'}`}
                >
                  <span className={`transition-transform duration-300 ${isActive ? 'scale-110 text-white' : 'group-hover:scale-110'}`}>{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 mt-auto border-t border-gray-200 dark:border-white/5 space-y-2">
            <Link 
              to="/"
              className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-xl font-medium bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              <Globe size={18} />
              <span>Saytga qaytish</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-xl font-medium bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
            >
              <LogOut size={18} />
              <span>Chiqish</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen max-w-[100vw] flex flex-col">
          {/* Topbar inside Main */}
          <header className="hidden md:flex h-20 items-center justify-between px-8 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md border-b border-gray-100 dark:border-white/5 sticky top-0 z-40">
             <div className="flex items-center gap-4">
                <div className="relative">
                   <input type="text" placeholder="Qidirish..." className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 text-[#1d1d1f] dark:text-white transition-all shadow-sm focus:shadow-md" onKeyDown={(e) => { if(e.key === 'Enter') toast("Qidiruv funksiyasi hozircha ulanmagan") }} />
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <button onClick={() => toast("Yangi xabarlar yo'q")} className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors active:scale-95">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                   <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0a0a]"></span>
                </button>
                <div className="h-8 w-px bg-gray-200 dark:bg-white/10 mx-2"></div>
                <div onClick={handleLogout} className="flex items-center gap-3 cursor-pointer group px-2 py-1 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                   <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-md transition-shadow">
                      S
                   </div>
                   <div className="hidden lg:block">
                      <p className="text-sm font-semibold text-[#1d1d1f] dark:text-white leading-tight group-hover:text-blue-500 transition-colors">Sanjarbek</p>
                      <p className="text-xs text-gray-500 font-medium">Admin</p>
                   </div>
                </div>
             </div>
          </header>

          <div className="p-4 md:p-8 flex-1 max-w-[1400px] w-full mx-auto">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<ProjectsManager />} />
                <Route path="/services" element={<ServicesManager />} />
                <Route path="/experience" element={<ExperienceManager />} />
                <Route path="/education" element={<EducationManager />} />
                <Route path="/skills" element={<SkillsManager />} />
                <Route path="/certs" element={<CertificatesManager />} />
                <Route path="/messages" element={<MessagesManager />} />
                <Route path="/guestbook" element={<GuestbookManager />} />
                <Route path="/translations" element={<TranslationsManager />} />
                <Route path="/sessions" element={<SessionsManager />} />
                <Route path="/settings" element={<SettingsManager />} />
              </Routes>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
