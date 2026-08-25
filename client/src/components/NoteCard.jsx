function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function formatDate(isoString) {
  if (!isoString) return '';
  try {
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

const NoteCard = ({ note, onClick, onDelete }) => {
  const handleKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const excerpt = note.excerpt
    ? note.excerpt
    : stripHtml(note.content || '');

  const displayDate = note.updatedAt || formatDate(note.updated_at);

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Open note: ${note.title}`}
      className="bg-dusty-denim/10 backdrop-blur-sm border border-outline/40 rounded-[20px] p-7 hover:shadow-floating hover:-translate-y-1.5 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 ease-out cursor-pointer group flex flex-col h-[260px] relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex justify-between items-start mb-4 gap-4">
        <h3 className="font-headline-lg-mobile text-[22px] text-on-surface group-hover:text-primary transition-colors line-clamp-1 tracking-tight font-extrabold">
          {note.title}
        </h3>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) onDelete(note.id);
          }}
          className="relative z-10 text-on-surface-variant/60 hover:text-danger hover:bg-danger/10 focus:text-danger focus:bg-danger/10 transition-all opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 outline-none rounded-full p-2"
          title="Delete Note"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
      
      <p className="font-body-md text-[15px] text-on-surface-variant line-clamp-4 flex-1 mt-1 leading-[1.6]">
        {excerpt || '(no content)'}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-6 border-t border-outline/30">
        <span className="font-label-sm text-[13px] text-on-surface-variant/70 flex items-center gap-1.5 font-medium">
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
          {displayDate}
        </span>
        <div className="flex gap-2 flex-wrap justify-end">
          {note.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="px-3 py-1 bg-primary/10 rounded-full font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold">
              {tag}
            </span>
          ))}
          {note.tags?.length > 3 && (
            <span className="px-2 py-1 bg-surface border border-outline/40 rounded-full font-label-sm text-[11px] text-on-surface-variant font-bold">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
