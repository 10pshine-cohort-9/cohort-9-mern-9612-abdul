import React from 'react';

const NoteCard = ({ note, onClick, onDelete }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div 
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      className="bg-white border border-outline-variant rounded-[16px] p-lg hover:border-[#76777e] focus:border-primary focus:outline-none transition-colors cursor-pointer group flex flex-col h-[200px]"
    >
      <div className="flex justify-between items-start mb-sm gap-2">
        <h3 className="text-xl font-semibold text-on-background group-hover:text-primary transition-colors line-clamp-1">{note.title}</h3>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) onDelete(note.id);
          }}
          className="text-[#76777e] hover:text-[#ba1a1a] focus:text-[#ba1a1a] transition-colors opacity-0 group-hover:opacity-100 group-focus:opacity-100 focus:opacity-100 outline-none"
          title="Delete Note"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 flex-1">
        {note.content}
      </p>
      <div className="flex items-center justify-between mt-auto pt-md border-t border-[#e4e2e4]">
        <span className="font-label-sm text-label-sm text-[#76777e]">Edited {note.updatedAt}</span>
        <div className="flex gap-xs">
          {note.tags?.map(tag => (
            <span key={tag} className="px-sm py-[2px] bg-[#f0edf0] rounded-full font-label-sm text-label-sm text-on-surface-variant border border-outline-variant">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
