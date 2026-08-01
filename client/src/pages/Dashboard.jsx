import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteCard from '../components/NoteCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const fetchNotes = async () => {
      try {
 
        const mockNotes = [
          {
            id: '1',
            title: 'Q3 Product Strategy Review',
            content: 'Key takeaways from the alignment meeting. We need to focus on streamlining the onboarding flow and reducing friction in the initial user setup phase.',
            updatedAt: '2h ago',
            tags: ['Strategy']
          },
          {
            id: '2',
            title: 'Design System Audit',
            content: 'Reviewing the current component library for inconsistencies. The typography scale needs adjustment on mobile breakpoints to ensure readability.',
            updatedAt: 'yesterday',
            tags: ['Design', 'Audit']
          }
        ];
        
        setNotes(mockNotes);
      } catch (error) {
        console.error('Failed to fetch notes', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleCreateNote = () => {
 
    navigate('/editor/new');
  };

  const handleEditNote = (noteId) => {
  
    navigate(`/editor/${noteId}`);
  };

  const handleDeleteNote = (noteId) => {
    setNotes(prevNotes => prevNotes.filter(n => n.id !== noteId));
  };

  return (
    <div className="font-body-md text-body-md text-on-background antialiased flex h-screen overflow-hidden bg-[#fbf8fb]">
  
      <div className="flex-1 flex flex-col w-full">
        <header className="h-16 w-full sticky top-0 z-40 bg-[#fbf8fb] border-b border-outline-variant flex justify-between items-center px-4 md:px-8 shadow-none">
          <div className="flex items-center gap-lg">
            <div className="text-xl font-bold text-primary">Editorial Workspace</div>
          </div>
          <button onClick={handleCreateNote} className="bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Note
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-[1200px] mx-auto w-full">
          <div className="mb-xl flex justify-between items-start md:items-center">
            <div>
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">All Notes</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Your complete collection of thoughts and drafts.</p>
            </div>
          </div>
          
          {isLoading ? (
            <p className="text-on-surface-variant">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="text-on-surface-variant">No notes found. Create one to get started!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onClick={() => handleEditNote(note.id)} 
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
