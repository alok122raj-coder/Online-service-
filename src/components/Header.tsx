import { Shield, LogOut } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, loginWithGoogle, logout } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const [user, loading] = useAuthState(auth);

  return (
    <header className="bg-[#000080] text-white px-4 py-4 md:px-8 md:py-5 flex items-center justify-between border-b-4 border-orange-500 shadow-lg shrink-0">
      <div className="flex items-center gap-4">
        <div className="bg-white p-1 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl md:text-2xl shadow-inner">
          🇮🇳
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-serif tracking-tight leading-none italic text-white">भारत सरकारी सेवा पोर्टल</h1>
          <p className="text-[9px] md:text-[10px] text-blue-200 uppercase tracking-[0.2em] font-semibold mt-1">Integrated Government Services Gateway</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <AnimatePresence mode="wait">
          {!loading && !user && (
            <motion.button
              key="login"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => loginWithGoogle()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-bold text-xs md:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <span>🔐</span>
              <span className="hidden sm:inline">Admin Login</span>
              <span className="sm:hidden">Login</span>
            </motion.button>
          )}
          {!loading && user && (
            <motion.div
              key="user"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <div className="hidden md:block text-right">
                <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">{user.displayName || 'Admin Account'}</div>
                <div className="text-[8px] text-blue-200/60 font-mono">{user.email}</div>
              </div>
              <button
                onClick={() => logout()}
                className="bg-red-500/20 border border-red-500/50 text-white p-2 rounded hover:bg-red-500 transition-all shadow-sm"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
