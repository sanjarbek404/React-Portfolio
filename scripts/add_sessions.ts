import fs from 'fs';

let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// 1. Check if 'Laptop' is imported, if not, add it.
if (!content.includes('Laptop,')) {
    content = content.replace(/import \{ Github, LayoutDashboard,/, 'import { Github, LayoutDashboard, Laptop, Activity,');
}

// 2. Add SessionsManager
const sessionsManagerCode = `
const SessionsManager = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    const q = query(collection(db, 'sessions'), orderBy('lastActive', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSessions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
`;

if (!content.includes('const SessionsManager = () => {')) {
  content = content.replace(/(export default function Admin\(\) \{)/, sessionsManagerCode + '\n$1');
}

// 3. Add to navigation
if (!content.includes('path: \'/admin/sessions\'')) {
  // Add right before Settings
  content = content.replace(
    /\{\s*path:\s*'\/admin\/settings'/g, 
    "{ path: '/admin/sessions', icon: <Activity className=\"w-5 h-5\" />, label: 'Seanslar' },\n    { path: '/admin/settings'"
  );
}

// 4. Add Route
if (!content.includes('element={<SessionsManager />}')) {
  content = content.replace(
    /<Route path="\/settings" element=\{<SettingsManager \/>\} \/>/g,
    '<Route path="/sessions" element={<SessionsManager />} />\n                <Route path="/settings" element={<SettingsManager />} />'
  );
}

// 5. Enhance Admin menu UI nicely
content = content.replace(
  /className="text-\[#1d1d1f\] dark:text-white font-semibold flex items-center gap-3 w-full bg-gray-100 dark:bg-white\/10 px-4 py-3 rounded-2xl"/g,
  'className="text-white font-semibold flex items-center gap-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 rounded-2xl shadow-lg shadow-blue-500/25"'
);

content = content.replace(
  /className="text-gray-500 hover:text-\[#1d1d1f\] dark:hover:text-white font-medium flex items-center gap-3 w-full hover:bg-gray-100 dark:hover:bg-white\/5 px-4 py-3 rounded-2xl transition-all"/g,
  'className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white font-medium flex items-center gap-3 w-full hover:bg-white dark:hover:bg-white/5 px-4 py-3 rounded-2xl transition-all shadow-sm hover:shadow-md"'
);

// We need to add session monitoring logic to `Admin`
const sessionMonitorCode = `
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
`;

if (!content.includes("if (!docSnap.exists()) {")) {
  content = content.replace(
    /const navigate = useNavigate\(\);\n  const location = useLocation\(\);/g,
    "const navigate = useNavigate();\n  const location = useLocation();\n" + sessionMonitorCode
  );
}

fs.writeFileSync('src/pages/Admin.tsx', content);
console.log('Admin panel updated!');
