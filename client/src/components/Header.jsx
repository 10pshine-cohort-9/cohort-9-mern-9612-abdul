import React from 'react';
import UserProfile from './UserProfile';

const Header = ({ children }) => {
  return (
    <header className="h-16 w-full sticky top-0 z-40 bg-[#fbf8fb] border-b border-outline-variant flex justify-between items-center px-4 md:px-8 shadow-none">
      <div className="flex items-center gap-lg">
        <div className="text-xl font-bold text-primary">Editorial Workspace</div>
      </div>
      <div className="flex items-center gap-md">
        {children}
        <UserProfile />
      </div>
    </header>
  );
};

export default Header;
