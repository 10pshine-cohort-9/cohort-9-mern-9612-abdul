import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authService';

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateNote = () => {
    navigate('/notes/new');
  };

  const handleLogout = async () => {
    const logoutRequest = logoutUser();

    logout();
    navigate('/login', { replace: true });

    try {
      await logoutRequest;
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2.5 bg-primary text-white rounded-full shadow-subtle border border-transparent flex items-center justify-center hover:bg-primary-hover active:scale-95 transition-all"
        aria-label="Open sidebar"
      >
        <span className="material-symbols-outlined text-[24px]">menu</span>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-ink-black/40 backdrop-blur-sm z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-sidebar/95 backdrop-blur-xl text-sidebar-text flex flex-col border-r border-sidebar-border/50 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <button
        onClick={() => {
          navigate('/dashboard');
          setIsOpen(false);
        }}
        className="h-20 flex items-center justify-between px-6 border-b border-sidebar-border/50 hover:bg-sidebar-hover/30 transition-colors focus:outline-none w-full"
      >
        <div className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
            <span className="material-symbols-outlined text-primary text-[20px]">book_4</span>
          </div>
          <span className="truncate">SHINE Notes</span>
        </div>
        
        {/* Mobile Close Button (inside header) */}
        <div className="md:hidden w-8 h-8 flex items-center justify-center text-sidebar-muted hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
          <span className="material-symbols-outlined text-[20px]">close</span>
        </div>
      </button>

      <div className="px-5 py-8 flex-1">
        <button
          onClick={() => {
            handleCreateNote();
            setIsOpen(false);
          }}
          className="w-full bg-eggshell text-on-surface font-label-md py-3 px-4 rounded-editorial hover:bg-eggshell/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-card"
        >
          <span className="material-symbols-outlined text-[18px]">edit_square</span>
          New Note
        </button>
      </div>

      {children && (
        <div className="px-5 py-4 flex flex-col gap-3">
          {children}
        </div>
      )}

      <div className="p-4 border-t border-sidebar-border/50 bg-sidebar-hover/10 flex flex-col gap-2">
        {user && (
          <div className="mb-3 p-3 rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent border border-white/[0.05] flex items-center gap-3 shadow-lg hover:bg-white/[0.06] transition-all cursor-default group">
            <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-primary to-primary-hover flex items-center justify-center text-on-primary font-bold text-lg shadow-inner ring-2 ring-white/10 group-hover:ring-primary/40 transition-all">
              {typeof user.name === 'string' && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white truncate tracking-wide drop-shadow-sm">{user.name || 'User'}</span>
              <span className="text-xs text-sidebar-muted truncate opacity-90">{user.email}</span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-editorial hover:bg-sidebar-hover/50 transition-colors text-sidebar-muted hover:text-white font-label-md text-sm group"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:text-danger transition-colors">logout</span>
          Log out
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
