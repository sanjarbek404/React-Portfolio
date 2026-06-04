import React, { useEffect, useState } from 'react';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Send, MessageSquare, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export function Guestbook({ t }: { t: any }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check local storage for saved name
    const savedName = localStorage.getItem('guestbook_name');
    if (savedName) setUserName(savedName);
  }, []);

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'), limit(50));
      const unsub = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsub();
    }
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userName.trim() || !db) return;
    
    localStorage.setItem('guestbook_name', userName.trim());

    try {
      setLoading(true);
      await addDoc(collection(db, 'guestbook'), {
        text: newMessage.trim(),
        userName: userName.trim(),
        userPhoto: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName.trim())}`,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
      toast.success("Izohingiz qo'shildi!");
    } catch (err: any) {
      console.error(err);
      toast.error("Xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-6 text-blue-500">
          <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-current" />
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-black text-[#1d1d1f] dark:text-white mb-4 tracking-tight">Mehmonlar Kitobi</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Tashrifingiz uchun rahmat! Bu yerda o'z bahoingiz yoki izohingizni ro'yxatdan o'tmasdan qoldirishingiz mumkin.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-[2rem] border border-black/5 dark:border-white/10 p-6 md:p-10 shadow-xl relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <form onSubmit={sendMessage} className="relative mb-12 flex flex-col gap-4 max-w-3xl mx-auto">
          <div className="flex bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[1rem] overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-sm">
            <div className="pl-4 flex items-center justify-center text-gray-400">
              <User size={18} />
            </div>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={loading}
              maxLength={40}
              placeholder="Ismingizni kiriting..."
              className="w-full bg-transparent py-4 px-4 focus:outline-none text-[#1d1d1f] dark:text-white font-medium disabled:opacity-50"
            />
          </div>
          
          <div className="relative">
            <textarea
              required
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={loading}
              maxLength={1000}
              placeholder="Fikringizni qoldiring..."
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[1.5rem] py-4 px-6 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium resize-none disabled:opacity-50 transition-all shadow-sm"
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim() || !userName.trim() || loading}
              className="absolute bottom-4 right-4 bg-blue-600 text-white px-6 py-2.5 rounded-full flex items-center justify-center gap-2 font-bold hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-lg"
            >
              <span>{loading ? 'Yuborilmoqda...' : 'Yuborish'}</span>
              {!loading && <Send size={16} />}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6 border-b border-black/5 dark:border-white/10 pb-4">
            <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white">So'nggi fikrlar ({messages.length})</h3>
          </div>
          
          <AnimatePresence>
            {messages.length === 0 ? (
              <p className="text-center text-gray-400 py-10 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">Hozircha izohlar yo'q. Birinchi bo'lib izoh qoldiring!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-gray-50 dark:bg-white/[0.02] p-5 rounded-[1.5rem] flex flex-col gap-3 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img src={msg.userPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(msg.userName)}`} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 shadow-sm" />
                      <div>
                        <h4 className="font-bold text-sm text-[#1d1d1f] dark:text-white leading-tight">{msg.userName}</h4>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) : 'Hozirgina'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
