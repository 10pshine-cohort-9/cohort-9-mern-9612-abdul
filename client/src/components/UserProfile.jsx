import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const mockUser = {
  name: 'Abdul Khan',
  email: 'abdul.khan@company.com',
  role: 'Editor',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
};

const UserProfile = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    navigate('/login');
  };

  const initials = mockUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="h-9 w-9 rounded-full overflow-hidden hover:opacity-90 transition-opacity"
        title="Profile"
      >
        <img src={mockUser.avatar} alt={mockUser.name} className="h-full w-full object-cover" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-xs w-[260px] bg-white border border-outline-variant rounded-sm shadow-[0px_4px_12px_rgba(0,0,0,0.1)] z-50">
          <div className="p-md border-b border-outline-variant">
            <div className="flex items-center gap-sm">
                  <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                    <img src={mockUser.avatar} alt={mockUser.name} className="h-full w-full object-cover" />
                  </div>
              <div className="min-w-0">
                <p className="font-label-md text-label-md text-on-background truncate">{mockUser.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant truncate">{mockUser.email}</p>
              </div>
            </div>
            <span className="inline-block mt-sm px-sm py-[2px] bg-[#f0edf0] rounded-full font-label-sm text-label-sm text-on-surface-variant border border-outline-variant">
              {mockUser.role}
            </span>
          </div>
          <div className="p-xs">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-sm px-sm py-sm rounded-sm text-[#ba1a1a] hover:bg-[#fff0f0] transition-colors font-label-md text-label-md"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
