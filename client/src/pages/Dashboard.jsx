import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NoteCard from '../components/NoteCard';
import Sidebar from '../components/Sidebar';
import { fetchNotes, deleteNote } from '../services/notesService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      if (err.status === 401) {
        logout();
        navigate('/login', { replace: true });
      } else {
        setError(err.message || 'Failed to load notes.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleCreateNote = () => {
    navigate('/notes/new');
  };

  const handleEditNote = (noteId) => {
    navigate(`/notes/${noteId}/edit`);
  };

  const handleDeleteNote = async (noteId) => {
    const original = notes;
    setNotes((prev) => prev.filter((n) => n.id !== noteId));

    try {
      await deleteNote(noteId);
    } catch (err) {
      setNotes(original);
      if (err.status === 401) {
        logout();
        navigate('/login', { replace: true });
      } else {
        setError(err.message || 'Failed to delete note.');
      }
    }
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

          {error && (
            <div className="mb-8 flex items-center gap-2 px-4 py-3 bg-danger/10 border border-danger/30 rounded-editorial text-danger font-label-sm" role="alert">
              <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : notes.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-32 text-center">
              <span className="material-symbols-outlined text-[64px] text-outline mb-6">description</span>
              <h3 className="font-headline-lg-mobile text-on-surface mb-2">No notes yet</h3>
              <p className="text-on-surface-variant mb-8 whitespace-nowrap">Get started by creating your first note.</p>
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
