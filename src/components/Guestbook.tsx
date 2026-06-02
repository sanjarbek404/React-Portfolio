import React, { useEffect, useState } from 'react';
import { db, auth, githubProvider, signInWithPopup, isFirebaseConfigured, signOut } from '../lib/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Github, LogOut, Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export function Guestbook({ t }: { t: any }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth) {
      const unsub = auth.onAuthStateChanged((u: any) => setUser(u));
      return () => unsub();
    }
  }, []);

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'), limit(20));
      const unsub = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsub();
    }
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (err: any) {
      console.error(err);
      toast.error('GithHub orqali kirishda xatolik yuz berdi. (Firebase sozlamalarini tekshiring)');
    }
  };

  const logout = () => signOut(auth);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !db) return;
    
    try {
      setLoading(true);
      await addDoc(collection(db, 'guestbook'), {
        text: newMessage,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        userPhoto: user.photoURL,
        githubParams: user.reloadUserInfo?.screenName || null,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (err: any) {
      toast.error("Xabarni saqlashda xatolik! Firestore rules ni tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-black text-[#1d1d1f] dark:text-white mb-4 tracking-tight flex items-center justify-center gap-3"><MessageSquare className="w-8 h-8 md:w-12 md:h-12 text-blue-500" /> Mehmonlar Kitobi</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Saytga tashrif buyurganingiz uchun rahmat! Bu yerda o'z bahoingiz yoki izohingizni qoldirishingiz mumkin.</p>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-[2rem] border border-black/5 dark:border-white/10 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row gap-6 mb-10 items-start md:items-center justify-between bg-gray-50 dark:bg-white/5 p-4 rounded-[1.5rem] border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-4 flex-1">
            {user ? (
              <>
                <img src={user.photoURL} alt={user.displayName} className="w-12 h-12 rounded-full border-2 border-blue-500" />
                <div>
                  <p className="font-bold text-[#1d1d1f] dark:text-white">{user.displayName}</p>
                  <p className="text-xs text-gray-500">Tizimga kirdingiz</p>
                </div>
              </>
            ) : (
              <div>
                <p className="font-bold text-[#1d1d1f] dark:text-white mb-1">Fikr bildirish uchun kiring</p>
                <p className="text-xs text-gray-500">Ijtimoiy tarmoqlar orqali tezkor kirishingiz mumkin.</p>
              </div>
            )}
          </div>
          <div>
            {!user ? (
              <button onClick={login} className="flex items-center gap-2 bg-[#24292e] text-white px-5 py-2.5 rounded-full font-bold text-sm hover:-translate-y-1 hover:shadow-lg transition-all">
                <Github size={18} /> GitHub orqali kirish
              </button>
            ) : (
              <button onClick={logout} className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-full font-bold text-sm hover:bg-red-500 hover:text-white transition-colors">
                <LogOut size={16} /> Chiqish
              </button>
            )}
          </div>
        </div>

        <form onSubmit={sendMessage} className="relative mb-12">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!user || loading}
            placeholder={user ? "Izoh yozing..." : "Fikr bildirish uchun GitHub orqali kiring."}
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[1.5rem] py-4 px-6 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#1d1d1f] dark:text-white font-medium resize-none disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={!user || !newMessage.trim() || loading}
            className="absolute bottom-4 right-4 bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 transition-colors shadow-lg"
          >
            <Send size={16} className={newMessage.trim() ? 'ml-[-2px]' : ''} />
          </button>
        </form>

        <div className="space-y-4">
          <AnimatePresence>
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-6">Hozircha izohlar yo'q. Birinchi bo'lib izoh qoldiring!</p>
            ) : (
              messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl flex gap-4 border border-black/5 dark:border-white/5"
                >
                  <img src={msg.userPhoto || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.userName}`} alt="Avatar" className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1d1d1f] dark:text-white">{msg.userName}</span>
                        {msg.githubParams && <span className="text-[10px] text-gray-500 bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-full">@{msg.githubParams}</span>}
                      </div>
                      <span className="text-[10px] text-gray-400">{msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString() : 'Yaqinda'}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
