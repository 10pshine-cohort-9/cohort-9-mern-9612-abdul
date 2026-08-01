import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleCreateNote = () => {
    navigate('/editor/new');
  };

  return (
    <nav className="hidden md:flex w-[280px] h-full fixed left-0 top-0 border-r border-outline-variant bg-[#fbf8fb] flex-col py-lg px-md z-50 shadow-none">
      <div className="flex items-center gap-md mb-xl px-sm">
        <div className="w-10 h-10 rounded-full border border-outline-variant overflow-hidden flex-shrink-0">
          <img
            alt="User profile avatar"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdmJyCS_5fUD62pxEO1E0ioUfXmOeBrHQVAtOtADDenN1K-24TrlB5dGD9HoGSyTFVGzgBRspqz3j_JVx788cmtaFKVsvqQWb_CTObcvs0zFEuEqYg--PdcxsGOU-1ETKlkGY2Ltvy-En8sNaXrqO_AQIzQP6Gpifc_q6FlcR9LEtNUR1Ku3UfW94fvpX9F0JXa4AJ-EIaaLAMoboJwSipJ6jssDrwPRfPquaRmfh-SkL89gzsFVhRvQ"
          />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-primary">Editorial Notes</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Personal Workspace</p>
        </div>
      </div>

      <button onClick={handleCreateNote} className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-lg mb-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-sm">
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        New Note
      </button>

      <div className="flex-1 overflow-y-auto space-y-xs">
        <a onClick={() => navigate('/dashboard')} className="flex items-center gap-md py-sm px-md rounded-lg cursor-pointer transition-colors text-primary font-bold border-l-4 border-primary bg-[#f5f3f5]">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
          <span className="font-label-md text-label-md">All Notes</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
