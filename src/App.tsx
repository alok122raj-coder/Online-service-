import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Ticker from './components/Ticker';
import Tabs from './components/Tabs';
import SearchBar from './components/SearchBar';
import LinkCard from './components/LinkCard';
import GovLinkModal from './components/GovLinkModal';
import { Category, GovLink, CATEGORIES } from './types';
import { db, auth, OperationType, handleFirestoreError } from './lib/firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Info, Database } from 'lucide-react';

export default function App() {
  const [links, setLinks] = useState<GovLink[]>([]);
  const [activeTab, setActiveTab] = useState<Category>('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [user] = useAuthState(auth);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<GovLink | null>(null);

  // Fetch links from Firestore
  useEffect(() => {
    const q = query(collection(db, 'links'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const linksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GovLink[];
      setLinks(linksData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'links');
    });

    return () => unsubscribe();
  }, []);

  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      const matchesTab = link.category === activeTab;
      const matchesSearch = searchQuery === '' || 
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [links, activeTab, searchQuery]);

  // Check if current user is admin (hardcoded logic + Firestore lookup)
  const isAdmin = useMemo(() => {
    return user?.email === 'rautshambhuraut747@gmail.com';
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      await deleteDoc(doc(db, 'links', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `links/${id}`);
    }
  };

  const stats = useMemo(() => {
    return {
      jobs: links.filter(l => l.category === 'jobs').length,
      results: links.filter(l => l.category === 'results').length,
      admit: links.filter(l => l.category === 'admit').length,
      admission: links.filter(l => l.category === 'admission').length,
    };
  }, [links]);

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans">
      <Header />
      <Ticker />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Stats Row - Professional Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard label="Live Jobs" value={stats.jobs} color="text-orange-600" bg="bg-orange-50" icon="💼" />
          <StatCard label="Exam Results" value={stats.results} color="text-green-600" bg="bg-green-50" icon="📋" />
          <StatCard label="Admit Cards" value={stats.admit} color="text-blue-600" bg="bg-blue-50" icon="🪪" />
          <StatCard label="Admissions" value={stats.admission} color="text-purple-600" bg="bg-purple-50" icon="🎓" />
        </div>

        {/* Professional Global Notice */}
        <div className="bg-blue-900 text-white p-5 rounded-2xl shadow-xl flex gap-4 items-center">
          <div className="bg-white/20 p-2 rounded-lg">
            <Info className="text-white" size={24} />
          </div>
          <p className="text-xs md:text-sm font-medium leading-relaxed">
            आधिकारिक सूचना: सभी लिंक सीधे सरकारी विभागों से एकीकृत हैं। भर्ती और परिणामों की नवीनतम जानकारी के लिए पोर्टल का नियमित अवलोकन करें।
          </p>
        </div>

        {/* Admin Actions */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                  <Database size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Master Control</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Database</p>
                </div>
              </div>
              <button
                onClick={() => { setEditingLink(null); setIsModalOpen(true); }}
                className="bg-[#000080] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20"
              >
                <Plus size={18} /> New Entry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Section List */}
        <div className="space-y-6 pb-20">
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
            <h3 className="text-xl font-serif font-black text-slate-800 flex items-center gap-3 italic">
              {CATEGORIES.find(c => c.id === activeTab)?.label} Updates
              <span className="bg-slate-800 text-white text-[10px] items-center justify-center flex font-mono h-5 px-2 rounded-full tracking-tighter not-italic">{filteredLinks.length} TOTAL</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  isAdmin={isAdmin}
                  onEdit={(l) => { setEditingLink(l); setIsModalOpen(true); }}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
            
            {filteredLinks.length === 0 && (
              <div className="py-32 text-center flex flex-col items-center justify-center grayscale opacity-20">
                <Database size={64} className="mb-4" />
                <p className="font-bold uppercase tracking-[0.3em] text-sm">Synchronizing Data Structures...</p>
                <p className="text-xs mt-2 font-mono">No active records found in current partition</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-slate-200 py-4 px-8 text-center text-slate-500 text-[10px] md:text-[11px] font-bold border-t border-slate-300 tracking-wider">
        © 2025 भारत सरकारी सेवा पोर्टल • NIC CLOUD DATA HUB • OFFICIAL GOVERNMENT GATEWAY
      </footer>

      <GovLinkModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingLink(null); }}
        linkToEdit={editingLink}
      />
    </div>
  );
}

function StatCard({ label, value, color, bg, icon }: { label: string; value: number; color: string; bg: string; icon: string }) {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition-all hover:shadow-md flex items-center gap-4`}>
      <div className={`${bg} ${color} p-3 rounded-2xl text-2xl`}>{icon}</div>
      <div>
        <div className={`text-2xl font-mono font-black ${color}`}>{value}</div>
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</div>
      </div>
    </div>
  );
}
