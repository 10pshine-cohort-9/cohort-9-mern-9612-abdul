import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import Sidebar from '../components/Sidebar';
import { getNotes, saveNotes } from '../utils/storage';

const Dashboard = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const savedNotes = getNotes();
        setNotes(savedNotes);
        if (savedNotes.length === 0) {
          saveNotes([]);
        }
      } catch (error) {
        console.error('Failed to fetch notes', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleCreateNote = () => {
    navigate('/notes/new');
  };

  const handleEditNote = (noteId) => {
    navigate(`/notes/${noteId}/edit`);
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter(n => n.id !== noteId);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  return (
    <div className="font-body-md text-on-surface antialiased flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full ml-64">
        <main className="flex-1 overflow-y-auto p-8 md:p-12 max-w-[1400px] mx-auto w-full">
          <div className="mb-12 flex justify-between items-end border-b border-outline/30 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary text-3xl">auto_awesome_mosaic</span>
                <h1 className="font-headline-lg text-4xl font-extrabold text-on-surface tracking-tight">All Notes</h1>
              </div>
              <p className="font-body-md text-on-surface-variant text-lg">Manage and organize your thoughts seamlessly.</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-full shadow-subtle">
                <span className="material-symbols-outlined text-[18px]">library_books</span>
                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-on-surface-variant">
              <p>Loading your notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <span className="material-symbols-outlined text-[64px] text-outline mb-6">description</span>
              <h3 className="font-headline-lg-mobile text-on-surface mb-2">No notes yet</h3>
              <p className="text-on-surface-variant mb-8 max-w-md">Get started by creating your first note. It will be safely stored locally.</p>
              <button
                onClick={handleCreateNote}
                className="bg-primary text-on-primary font-label-md py-3 px-8 rounded-editorial hover:bg-primary-hover active:scale-[0.98] transition-all shadow-subtle"
              >
                Create First Note
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
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
