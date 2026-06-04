import fs from 'fs';

let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// The Dashboard component fetching additional info
const additionalFetch = `
  const [projectsCount, setProjectsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => setProjectsCount(snap.size));
    const unsubMessages = onSnapshot(collection(db, 'messages'), (snap) => setMessagesCount(snap.size));
    
    return () => { unsubProjects(); unsubMessages(); };
  }, []);
`;


if (!content.includes('const [projectsCount, setProjectsCount] = useState(0);')) {
  // Inject additional hooks after totals useState
  content = content.replace(
    /const \[totals, setTotals\] = useState\(\{ views: 0, visitors: 0 \}\);\n  const \[loading, setLoading\] = useState\(true\);/,
    "const [totals, setTotals] = useState({ views: 0, visitors: 0 });\n  const [loading, setLoading] = useState(true);\n" + additionalFetch
  );
}

// Add another row in Dashboard for these extra stats
const extraWidgets = `
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
`;

if (!content.includes('Jami Loyihalar')) {
  content = content.replace(
    /<\/div>\s*<div className="w-full h-\[400px\]">/,
    "</div>\n" + extraWidgets + "\n        <div className=\"w-full h-[400px]\">"
  );
}

fs.writeFileSync('src/pages/Admin.tsx', content);
console.log('Dashboard enhanced!');
